'use client'

import AdminCalendar, { CalendarEvent, EventStatus } from '@/components/AdminCalendar'
import { addHours, startOfToday, addDays, format, parseISO } from 'date-fns'
import { useState, useEffect } from 'react'
import { fetchBookings, createBooking, markAsPaid, cancelBooking } from '../../api/admin/actions' // Importamos las acciones reales

// Eliminamos los datos "hardcodeados" iniciales y empezamos vacíos
const initialEvents: CalendarEvent[] = []

export default function CalendarPage() {
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
    const [isLoading, setIsLoading] = useState(true)

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

    const [newEventTitle, setNewEventTitle] = useState('')
    const [newEventPhone, setNewEventPhone] = useState('')

    const [formDate, setFormDate] = useState('')
    const [formStartTime, setFormStartTime] = useState('')
    const [formEndTime, setFormEndTime] = useState('')

    // 1. CARGAR DATOS REALES AL INICIAR
    useEffect(() => {
        loadBookings()
    }, [])

    const loadBookings = async () => {
        setIsLoading(true)
        try {
            const data = await fetchBookings()
            setEvents(data)
        } catch (error) {
            console.error("Error cargando citas:", error)
            alert("Error al cargar las citas. Revisa tu conexión.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
        setFormDate(format(start, 'yyyy-MM-dd'))
        setFormStartTime(format(start, 'HH:mm'))
        setFormEndTime(format(end, 'HH:mm'))

        setNewEventTitle('')
        setNewEventPhone('')
        setIsAddModalOpen(true)
    }

    const handleManualOpen = () => {
        const now = new Date()
        const oneHourLater = addHours(now, 1)

        setFormDate(format(now, 'yyyy-MM-dd'))
        setFormStartTime(format(now, 'HH:mm'))
        setFormEndTime(format(oneHourLater, 'HH:mm'))

        setNewEventTitle('')
        setNewEventPhone('')
        setIsAddModalOpen(true)
    }

    const handleSelectEvent = (event: CalendarEvent) => {
        setSelectedEvent(event)
        setIsDetailModalOpen(true)
    }

    // 2. CONEXIÓN: MARCAR COMO PAGADO
    const handleMarkAsPaid = async () => {
        if (!selectedEvent) return

        if (
            confirm(
                `¿Confirmas que ${selectedEvent.resource?.clientName} pagó el total restante de $${selectedEvent.resource?.amountPending}?`
            )
        ) {
            const total = (selectedEvent.resource?.amountPaid || 0) + (selectedEvent.resource?.amountPending || 0)

            // Llamada al servidor
            const result = await markAsPaid(selectedEvent.id, total)

            if (result.success) {
                // Actualización optimista (Visual inmediata)
                const updatedEvents = events.map((e) => {
                    if (e.id === selectedEvent.id) {
                        return {
                            ...e,
                            resource: {
                                ...e.resource!,
                                status: 'paid_full' as EventStatus,
                                amountPaid: total,
                                amountPending: 0,
                            },
                        }
                    }
                    return e
                })
                setEvents(updatedEvents)
                setIsDetailModalOpen(false)
                setSelectedEvent(null)

                // Recarga segura en segundo plano
                loadBookings()
            } else {
                alert("Hubo un error al actualizar el pago.")
            }
        }
    }

    // 3. CONEXIÓN: GUARDAR NUEVA CITA MANUAL
    const handleSaveEvent = async (e: React.FormEvent) => {
        e.preventDefault()

        const startDateTime = parseISO(`${formDate}T${formStartTime}`)
        const endDateTime = parseISO(`${formDate}T${formEndTime}`)

        if (endDateTime <= startDateTime) {
            alert('La hora de fin debe ser después de la hora de inicio')
            return
        }

        // Llamada al servidor (Usamos createBooking reutilizando la lógica)
        // Nota: Para citas manuales, asumimos un precio estándar o $0 inicial.
        // Aquí ponemos $100 como ejemplo, pagado $0.
        const result = await createBooking({
            serviceId: 'manual', // Identificador especial
            serviceName: newEventTitle, // Usamos el título como nombre del servicio/cliente
            clientName: newEventTitle,
            clientEmail: 'manual@local.com', // Placeholder para manuales sin email
            clientPhone: newEventPhone,
            startTime: startDateTime,
            endTime: endDateTime,
            amountTotal: 100, // Precio base editable luego si quieres
            amountPaid: 0
        })

        if (result.success) {
            await loadBookings() // Recargar todo para ver el nuevo ID real
            setIsAddModalOpen(false)
        } else {
            alert("Error al guardar la cita manual.")
        }
    }

    // 4. CONEXIÓN: ELIMINAR CITA
    const handleDeleteEvent = async () => {
        if (!selectedEvent) return
        if (
            confirm(
                '¿Estás seguro de cancelar esta cita? El horario quedará libre inmediatamente.'
            )
        ) {
            // Llamada al servidor
            const result = await cancelBooking(selectedEvent.id)

            if (result.success) {
                const updatedEvents = events.filter((e) => e.id !== selectedEvent.id)
                setEvents(updatedEvents)
                setIsDetailModalOpen(false)
                setSelectedEvent(null)
            } else {
                alert("Error al cancelar la cita.")
            }
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[500px] items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                    <p className="text-sm font-medium uppercase tracking-widest">Cargando Agenda...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 relative">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 mb-1">
                        Panel de Reservas
                    </p>
                    <h2 className="text-2xl md:text-[26px] font-semibold tracking-tight text-slate-900">
                        Agenda de Citas
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Gestiona tus reservas, pagos y espacios disponibles de forma clara.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleManualOpen}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                    >
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-lg leading-none">
                            +
                        </span>
                        <span>Agendar cita manual</span>
                    </button>
                </div>
            </div>

            {/* CALENDARIO */}
            <AdminCalendar
                events={events}
                onAddEvent={handleSelectSlot}
                onEventClick={handleSelectEvent}
            />

            {/* LEYENDA */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-600 mt-2 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="inline-flex h-3.5 w-3.5 rounded-full border border-emerald-600 bg-[#E6FFFA]" />
                    <span className="font-medium">Pagado completo</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex h-3.5 w-3.5 rounded-full border border-amber-500 bg-[#FDFDEA]" />
                    <span className="font-medium">Pagó depósito (Stripe)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex h-3.5 w-3.5 rounded-full border border-sky-400 bg-[#EBF8FF]" />
                    <span className="font-medium">Cita manual / confianza</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex h-3.5 w-3.5 rounded-full border border-rose-400 bg-[#FFF5F5]" />
                    <span className="font-medium">Pendiente / revisar</span>
                </div>
            </div>

            {/* MODAL NUEVA CITA */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-[0_24px_80px_rgba(15,23,42,0.55)] w-full max-w-md overflow-hidden border border-slate-100">
                        <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-white">
                                    Nueva cita manual
                                </h3>
                                <p className="text-xs text-emerald-100 mt-0.5">
                                    Registra una reserva rápida para clientes de confianza.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="rounded-full p-1 text-emerald-50 hover:bg-emerald-900/40"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveEvent} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-[0.14em] mb-1.5">
                                        Fecha
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition"
                                        value={formDate}
                                        onChange={(e) => setFormDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-[0.14em] mb-1.5">
                                        Inicio
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition"
                                        value={formStartTime}
                                        onChange={(e) => setFormStartTime(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-[0.14em] mb-1.5">
                                        Fin
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition"
                                        value={formEndTime}
                                        onChange={(e) => setFormEndTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-slate-100 my-1" />

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-[0.14em] mb-1.5">
                                    Nombre del cliente
                                </label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition"
                                    placeholder="Ej: Laura Martínez"
                                    value={newEventTitle}
                                    onChange={(e) => setNewEventTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-[0.14em] mb-1.5">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition"
                                    placeholder="+1 ..."
                                    value={newEventPhone}
                                    onChange={(e) => setNewEventPhone(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/40 hover:bg-emerald-700 transition transform hover:-translate-y-0.5"
                                >
                                    Guardar cita
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DETALLES */}
            {isDetailModalOpen && selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-[0_24px_80px_rgba(15,23,42,0.55)] w-full max-w-md overflow-hidden border border-slate-100">
                        <div
                            className={`px-6 py-4 flex justify-between items-start ${selectedEvent.resource?.status === 'paid_full'
                                ? 'bg-gradient-to-r from-emerald-700 to-emerald-800'
                                : 'bg-gradient-to-r from-slate-900 to-emerald-900'
                                }`}
                        >
                            <div>
                                <h3 className="text-[17px] font-semibold text-white mb-1 flex items-center gap-1.5">
                                    {selectedEvent.resource?.status === 'paid_full' && (
                                        <span className="text-lg">✅</span>
                                    )}
                                    <span>{selectedEvent.title}</span>
                                </h3>
                                <p className="text-emerald-50/80 text-xs">
                                    🕒 {format(selectedEvent.start, 'HH:mm')} –{' '}
                                    {format(selectedEvent.end, 'HH:mm')}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="text-emerald-50/70 hover:text-white rounded-full p-1 hover:bg-black/20"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                                        <span className="block text-[11px] text-emerald-700 uppercase font-semibold tracking-[0.16em]">
                                            Pagado
                                        </span>
                                        <span className="text-2xl font-semibold text-emerald-900">
                                            ${selectedEvent.resource?.amountPaid}
                                        </span>
                                    </div>
                                    <div
                                        className={`p-3 rounded-xl border ${selectedEvent.resource?.amountPending === 0
                                            ? 'bg-slate-50 border-slate-100 opacity-60'
                                            : 'bg-amber-50 border-amber-100'
                                            }`}
                                    >
                                        <span className="block text-[11px] text-amber-700 uppercase font-semibold tracking-[0.16em]">
                                            Pendiente
                                        </span>
                                        <span className="text-2xl font-semibold text-amber-800">
                                            ${selectedEvent.resource?.amountPending}
                                        </span>
                                    </div>
                                </div>

                                {(selectedEvent.resource?.amountPending ?? 0) > 0 && (
                                    <button
                                        onClick={handleMarkAsPaid}
                                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-500/40 flex items-center justify-center gap-2 transition transform active:scale-95"
                                    >
                                        <span>💸</span>
                                        <span>Marcar como pagado completo</span>
                                    </button>
                                )}

                                {(selectedEvent.resource?.amountPending ?? 0) === 0 && (
                                    <div className="w-full py-2.5 bg-slate-50 text-slate-600 font-medium rounded-xl text-sm flex items-center justify-center gap-1">
                                        <span>✅</span>
                                        <span>Cuenta saldada</span>
                                    </div>
                                )}

                            </div>

                            <div className="space-y-3 pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-3 text-sm text-slate-800">
                                    <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-base">
                                        👤
                                    </span>
                                    <span className="font-medium">
                                        {selectedEvent.resource?.clientName || 'Sin nombre'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-800">
                                    <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-base">
                                        📞
                                    </span>
                                    <span>{selectedEvent.resource?.clientPhone || 'Sin teléfono'}</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm text-slate-700">
                                    <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-base">
                                        📝
                                    </span>
                                    <span className="italic text-slate-500">
                                        {selectedEvent.resource?.notes || 'Sin notas adicionales.'}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-5 mt-2 border-t border-slate-100 flex justify-between items-center">
                                <button
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="text-xs font-medium text-slate-500 hover:text-slate-700 hover:underline"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={handleDeleteEvent}
                                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
                                >
                                    🗑️ <span>Cancelar cita</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}