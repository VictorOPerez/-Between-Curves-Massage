'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { getService, ServiceData, SERVICES_DB } from '@/lib/services'
import { createStripeSession, getAvailableSlots } from '../api/admin/actions' // Usamos la nueva acción
import {
    format, addDays, startOfToday, isSameDay, isBefore,
    startOfMonth, endOfMonth, eachDayOfInterval,
    addMonths, subMonths, getDay, isToday, addMinutes
} from 'date-fns'
import { es } from 'date-fns/locale'

// --- ICONOS ---
const CheckIcon = () => <svg className="w-5 h-5 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
const ClockIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const ShieldIcon = () => <svg className="w-5 h-5 text-[#D4B886]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const CalendarIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
const ChevronDownIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
const ChevronLeftIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
const ChevronRightIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
const SunIcon = () => <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
const MoonIcon = () => <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>

export default function BookingPage() {
    const searchParams = useSearchParams()
    const dateInputRef = useRef<HTMLInputElement>(null)

    const [service, setService] = useState<ServiceData | null>(null)
    const [isLoadingPage, setIsLoadingPage] = useState(true)

    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday())
    const [selectedTime, setSelectedTime] = useState<string | null>(null)

    const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false)
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [currentMonth, setCurrentMonth] = useState(startOfToday())
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)

    useEffect(() => {
        const serviceSlug = searchParams.get('service')
        const data = getService(serviceSlug)
        setService(data)
        setIsLoadingPage(false)
    }, [searchParams])

    useEffect(() => {
        const fetchServerSlots = async () => {
            if (!service) return
            setIsLoadingSlots(true)
            setSelectedTime(null)

            const dateStr = format(selectedDate, 'yyyy-MM-dd')
            const response = await getAvailableSlots(dateStr, service.id)

            if (response.success && response.slots) {
                setAvailableSlots(response.slots)
            } else {
                setAvailableSlots([])
            }
            setIsLoadingSlots(false)
        }
        fetchServerSlots()
    }, [selectedDate, service])

    const selectService = (newService: ServiceData) => {
        setService(newService)
        setIsServiceMenuOpen(false)
        setSelectedTime(null)
    }

    // ACCIÓN DIRECTA DE PAGO
    const handleDirectBooking = async () => {
        if (!service || !selectedTime) return
        setIsSubmitting(true)

        const [hours, minutes] = selectedTime.split(':').map(Number)
        const startTime = new Date(selectedDate)
        startTime.setHours(hours, minutes)

        const endTime = new Date(startTime)
        endTime.setMinutes(startTime.getMinutes() + service.durationMin)

        // Llamamos a la acción que SOLO crea la sesión de Stripe
        const result = await createStripeSession({
            serviceId: service.id,
            serviceName: service.title,
            startTime,
            endTime,
            amountTotal: service.fullPrice,
            amountPaid: service.fullPrice * 0.10 // 10%
        })

        if (result.success && result.url) {
            window.location.href = result.url
        } else {
            alert("Hubo un error al conectar con Stripe. Intenta de nuevo.")
            setIsSubmitting(false)
        }
    }

    // --- CÁLCULOS VISUALES ---
    const horizontalDays = Array.from({ length: 14 }).map((_, i) => addDays(selectedDate, i - 1))
    const morningSlots = availableSlots.filter(time => parseInt(time.split(':')[0]) < 12)
    const afternoonSlots = availableSlots.filter(time => parseInt(time.split(':')[0]) >= 12)

    const getSlotLabel = (timeStr: string) => {
        if (!service) return timeStr
        const [hours, minutes] = timeStr.split(':').map(Number)
        const start = new Date()
        start.setHours(hours, minutes)
        const end = addMinutes(start, service.durationMin)
        return `${timeStr} - ${format(end, 'HH:mm')}`
    }

    const daysInMonth = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) })
    const firstDayOfMonth = getDay(startOfMonth(currentMonth))
    const emptyDays = Array(firstDayOfMonth).fill(null)
    const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.value) setSelectedDate(new Date(e.target.value + 'T00:00:00')) }

    if (!service || isLoadingPage) return (
        <div className="min-h-screen flex items-center justify-center bg-[#25413A] text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#2DD4BF] border-t-transparent rounded-full animate-spin"></div>
                <p className="animate-pulse tracking-widest text-sm uppercase">Cargando...</p>
            </div>
        </div>
    )

    const depositAmount = service.fullPrice * 0.10
    const remainingAmount = service.fullPrice - depositAmount
    const allServices = Object.values(SERVICES_DB)

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans pb-24 md:pb-0">

            {/* COLUMNA IZQUIERDA (Igual) */}
            <div className="w-full md:w-5/12 lg:w-1/3 bg-[#1D332E] text-white relative flex flex-col justify-end overflow-hidden shadow-2xl z-10">
                <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 ease-in-out key={service.id}" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13221E] via-[#13221E]/60 to-transparent"></div>
                <div className="relative z-10 p-8 md:p-12">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-[#D4B886] text-[10px] font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-md border border-white/10 shadow-lg">
                        <ShieldIcon /> Garantía Premium
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-4 drop-shadow-lg transition-all duration-300">{service.title}</h1>
                    <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-8 font-light border-l-2 border-[#2DD4BF] pl-4">{service.description}</p>
                    <div className="space-y-4 mb-8">
                        {service.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-gray-100 font-medium">
                                <div className="bg-[#2DD4BF]/20 p-1 rounded-full"><CheckIcon /></div>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 text-[#2DD4BF] text-sm font-bold tracking-wide uppercase bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                        <ClockIcon /> <span>Sesión de {service.durationMin} minutos</span>
                    </div>
                </div>
            </div>

            {/* COLUMNA DERECHA */}
            <div className="w-full md:w-7/12 lg:w-2/3 bg-[#FAFAFA] p-6 md:p-12 overflow-y-auto">
                <div className="max-w-2xl mx-auto">

                    {/* SELECTOR SERVICIO */}
                    <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-6 relative">
                        <div className="flex-1 relative">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Estás Reservando:</p>
                            <button onClick={() => setIsServiceMenuOpen(!isServiceMenuOpen)} className="group flex items-center gap-3 text-2xl md:text-3xl font-serif text-[#25413A] hover:text-[#2DD4BF] transition-colors focus:outline-none text-left">
                                {service.title} <ChevronDownIcon />
                            </button>
                            {isServiceMenuOpen && (
                                <div className="absolute top-full left-0 mt-2 w-full md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {allServices.map(s => (
                                        <button key={s.id} onClick={() => selectService(s)} className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between group ${service.id === s.id ? 'bg-gray-50' : ''}`}>
                                            <div>
                                                <p className={`font-serif text-lg ${service.id === s.id ? 'text-[#25413A] font-bold' : 'text-gray-600 group-hover:text-[#25413A]'}`}>{s.title}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{s.durationMin} min • ${s.fullPrice}</p>
                                            </div>
                                            {service.id === s.id && <CheckIcon />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="text-right hidden sm:block pl-4">
                            <p className="text-xs text-gray-400 uppercase">Inversión</p>
                            <p className="text-2xl font-bold text-[#25413A]">${service.fullPrice}</p>
                        </div>
                    </div>

                    {/* 1. SELECCIÓN DE DÍA */}
                    <div className="mb-10">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-bold text-[#25413A] flex items-center gap-2">
                                <span className="bg-[#25413A] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> SELECCIONA EL DÍA
                            </label>
                            <button onClick={() => setIsCalendarModalOpen(true)} className="text-xs font-bold text-[#25413A] hover:text-white hover:bg-[#25413A] transition-all uppercase tracking-wide border border-[#25413A] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                                <CalendarIcon /> Ver Calendario
                            </button>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 scrollbar-hide mask-fade-right">
                            {horizontalDays.map((day, i) => {
                                const isSelected = isSameDay(day, selectedDate)
                                const isPast = isBefore(day, startOfToday())

                                return (
                                    <button key={i} disabled={isPast} onClick={() => { setSelectedDate(day); setSelectedTime(null) }} className={`flex-shrink-0 w-[72px] h-24 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 group ${isSelected ? 'bg-[#25413A] border-[#25413A] text-white shadow-xl shadow-[#25413A]/20 scale-105 z-10' : isPast ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' : 'bg-white border-gray-200 text-gray-400 hover:border-[#2DD4BF] hover:text-[#25413A]'}`}>
                                        <span className="text-[10px] uppercase font-bold tracking-wider mb-1">{format(day, 'EEE', { locale: es })}</span>
                                        <span className={`text-2xl font-serif ${isSelected ? 'text-[#D4B886]' : ''}`}>{format(day, 'd')}</span>
                                        <span className="text-[10px] mt-1 capitalize opacity-70">{format(day, 'MMM', { locale: es })}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* 2. SELECCIÓN DE HORA (COMPACTA) */}
                    <div className="mb-12 min-h-[180px]">
                        <label className="text-sm font-bold text-[#25413A] flex items-center gap-2 mb-4">
                            <span className="bg-[#25413A] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> HORARIOS DISPONIBLES
                        </label>

                        {isLoadingSlots ? (
                            <div className="grid grid-cols-4 gap-3 animate-pulse">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-10 bg-gray-200 rounded-lg"></div>)}
                            </div>
                        ) : availableSlots.length > 0 ? (
                            <div className="space-y-6">
                                {morningSlots.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            <SunIcon /> Mañana
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {morningSlots.map((time) => (
                                                <button key={time} onClick={() => setSelectedTime(time)} className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all duration-200 ${selectedTime === time ? 'bg-[#2DD4BF] border-[#2DD4BF] text-[#13221E] shadow-md scale-105' : 'bg-white border-gray-200 text-gray-600 hover:border-[#25413A] hover:text-[#25413A]'}`}>
                                                    {getSlotLabel(time)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {afternoonSlots.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            <MoonIcon /> Tarde
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {afternoonSlots.map((time) => (
                                                <button key={time} onClick={() => setSelectedTime(time)} className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all duration-200 ${selectedTime === time ? 'bg-[#2DD4BF] border-[#2DD4BF] text-[#13221E] shadow-md scale-105' : 'bg-white border-gray-200 text-gray-600 hover:border-[#25413A] hover:text-[#25413A]'}`}>
                                                    {getSlotLabel(time)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm italic p-4 bg-gray-100 rounded-lg text-center">No hay horarios disponibles para este día.</p>
                        )}
                    </div>

                    {/* RESUMEN */}
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#D4B886]"></div>
                        <h3 className="text-[#25413A] font-serif text-xl mb-6">Detalle de la Inversión</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Servicio Seleccionado</span>
                                <span className="font-bold text-[#25413A]">{service.title}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <div>
                                    <p className="text-[#25413A] font-bold text-lg">Depósito de Reserva (10%)</p>
                                    <p className="text-xs text-[#2DD4BF] font-medium mt-1">*Pagable hoy vía Stripe Seguro</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-4xl font-serif text-[#25413A] font-bold">${depositAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BOTÓN FLOTANTE */}
                    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 md:static md:bg-transparent md:border-0 md:p-0 z-50">
                        <button onClick={handleDirectBooking} disabled={!selectedTime || isLoadingSlots || isSubmitting} className={`w-full py-4 md:py-5 rounded-xl text-lg font-bold text-white transition-all transform duration-300 shadow-2xl flex items-center justify-center gap-3 ${selectedTime ? 'bg-[#25413A] hover:bg-[#1a2e29] hover:-translate-y-1 hover:shadow-[#25413A]/40' : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}>
                            {isSubmitting ? 'Redirigiendo a Pago...' : selectedTime ? <><span>Ir a Pagar Depósito</span><span className="bg-white/20 px-2 py-0.5 rounded text-sm font-normal">${depositAmount.toFixed(2)}</span></> : 'Selecciona un horario'}
                        </button>
                    </div>

                    <p className="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-wider font-medium flex items-center justify-center gap-2 mb-20 md:mb-0">
                        <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg> Transacción encriptada SSL
                    </p>
                </div>
            </div>

            {/* MODAL CALENDARIO */}
            {isCalendarModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-[#25413A] p-6 flex justify-between items-center text-white">
                            <div><p className="text-xs font-bold text-[#2DD4BF] uppercase tracking-widest mb-1">Selecciona Fecha</p><h3 className="text-2xl font-serif capitalize">{format(currentMonth, 'MMMM yyyy', { locale: es })}</h3></div>
                            <div className="flex gap-2">
                                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-full transition"><ChevronLeftIcon /></button>
                                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-full transition"><ChevronRightIcon /></button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-7 mb-4 text-center">{['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(d => <div key={d} className="text-xs font-bold text-gray-400 uppercase">{d}</div>)}</div>
                            <div className="grid grid-cols-7 gap-2">
                                {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
                                {daysInMonth.map((day, i) => {
                                    const isSelected = isSameDay(day, selectedDate); const isPast = isBefore(day, startOfToday()); const isTodayDate = isToday(day);
                                    return (
                                        <button key={i} disabled={isPast} onClick={() => { setSelectedDate(day); setSelectedTime(null); setIsCalendarModalOpen(false) }} className={`aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all ${isSelected ? 'bg-[#25413A] text-[#D4B886] font-bold shadow-lg scale-110' : ''} ${!isSelected && !isPast ? 'hover:bg-[#2DD4BF]/20 hover:text-[#25413A] text-gray-700' : ''} ${isPast ? 'text-gray-300 cursor-not-allowed' : ''} ${isTodayDate && !isSelected ? 'border border-[#2DD4BF] text-[#2DD4BF]' : ''}`}>{format(day, 'd')}</button>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-end"><button onClick={() => setIsCalendarModalOpen(false)} className="px-6 py-2 text-gray-500 hover:text-gray-800 font-medium text-sm">Cancelar</button></div>
                    </div>
                </div>
            )}
        </div>
    )
}