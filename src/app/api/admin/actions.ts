'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createHash } from 'crypto'
import { supabase } from '@/lib/supabase'
import { sendConfirmationEmail } from '@/lib/email'
import { revalidatePath } from 'next/cache'
import { SERVICES_DB } from '@/lib/services'
import { addMinutes, setHours, setMinutes, isBefore, startOfDay, endOfDay, parseISO } from 'date-fns'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
})

const COOKIE_NAME = process.env.COOKIE_NAME || 'admin_session'
const PASSWORD = process.env.ADMIN_PASSWORD

// --- AUTENTICACIÓN ---
export async function loginAction(prevState: any, formData: FormData) {
    const passwordInput = formData.get('password') as string
    await new Promise(resolve => setTimeout(resolve, 500))

    if (passwordInput === PASSWORD) {
        const cookieStore = await cookies()
        cookieStore.set(COOKIE_NAME, passwordInput, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/',
        })
        redirect('/admin/calendar')
    } else {
        return { message: 'PIN incorrecto. Intenta de nuevo.' }
    }
}

// --- LÓGICA DE DISPONIBILIDAD ---
export async function getAvailableSlots(dateStr: string, serviceId: string) {
    try {
        const WORK_START_HOUR = 9
        const WORK_END_HOUR = 19
        const TIME_SLOT_INTERVAL = 30

        const service = SERVICES_DB[serviceId]
        if (!service) throw new Error('Servicio no encontrado')
        const duration = service.durationMin

        const searchDate = parseISO(dateStr)
        const startDay = startOfDay(searchDate).toISOString()
        const endDay = endOfDay(searchDate).toISOString()

        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('start_time, end_time')
            .gte('start_time', startDay)
            .lte('start_time', endDay)

        if (error) throw new Error(error.message)

        const slots: string[] = []
        let currentTime = setMinutes(setHours(searchDate, WORK_START_HOUR), 0)
        const endTimeLimit = setMinutes(setHours(searchDate, WORK_END_HOUR), 0)

        while (isBefore(currentTime, endTimeLimit)) {
            const potentialEnd = addMinutes(currentTime, duration)
            if (isBefore(endTimeLimit, potentialEnd)) break;

            const isOccupied = bookings?.some(booking => {
                const bookingStart = new Date(booking.start_time)
                const bookingEnd = new Date(booking.end_time)
                return (
                    (currentTime >= bookingStart && currentTime < bookingEnd) ||
                    (potentialEnd > bookingStart && potentialEnd <= bookingEnd) ||
                    (currentTime <= bookingStart && potentialEnd >= bookingEnd)
                )
            })

            if (!isOccupied) {
                slots.push(currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }))
            }
            currentTime = addMinutes(currentTime, TIME_SLOT_INTERVAL)
        }

        return { success: true, slots }

    } catch (error) {
        console.error('Error calculando slots:', error)
        return { success: false, slots: [] }
    }
}

// --- 1. CREAR SESIÓN STRIPE (Para el Cliente Web) ---
export async function createStripeSession(data: {
    serviceId: string;
    serviceName: string;
    startTime: Date;
    endTime: Date;
    amountTotal: number;
    amountPaid: number;
}) {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            phone_number_collection: { enabled: true },
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Depósito: ${data.serviceName}`,
                            description: `Reserva para el ${data.startTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} a las ${data.startTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
                        },
                        unit_amount: Math.round(data.amountPaid * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/book/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/book?service=${data.serviceId}`,
            metadata: {
                serviceId: data.serviceId,
                serviceName: data.serviceName,
                amountTotal: data.amountTotal.toString(),
                amountPaid: data.amountPaid.toString(),
                startTime: data.startTime.toISOString(),
                endTime: data.endTime.toISOString(),
            },
        })

        return { success: true, url: session.url }

    } catch (error: any) {
        console.error('Error Stripe:', error)
        return { success: false, error: error.message }
    }
}

// --- 2. CREAR RESERVA MANUAL (Para el Admin Calendar) ---
// Esta función guarda DIRECTAMENTE en la base de datos sin pasar por Stripe
export async function createBooking(data: {
    serviceId: string;
    serviceName: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    startTime: Date;
    endTime: Date;
    amountTotal: number;
    amountPaid: number;
}) {
    try {
        const { error } = await supabase.from('bookings').insert({
            service_id: data.serviceId,
            service_name: data.serviceName,
            client_name: data.clientName,
            client_email: data.clientEmail,
            client_phone: data.clientPhone,
            start_time: data.startTime.toISOString(),
            end_time: data.endTime.toISOString(),
            amount_total: data.amountTotal,
            amount_paid: data.amountPaid,
            amount_pending: data.amountTotal - data.amountPaid,
            status: 'confirmed_trust', // Estado para reservas manuales
            notes: 'Reserva Manual desde Admin'
        })

        if (error) throw new Error(error.message)

        revalidatePath('/admin/calendar')
        return { success: true }
    } catch (error) {
        console.error('Error creando reserva manual:', error)
        return { success: false, error }
    }
}

// --- ADMINISTRACIÓN ---
export async function fetchBookings() {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('start_time', { ascending: true })

    if (error) return []

    return data.map((booking: any) => ({
        id: booking.id,
        title: booking.client_name + ' - ' + booking.service_name,
        start: new Date(booking.start_time),
        end: new Date(booking.end_time),
        resource: {
            status: booking.status,
            clientName: booking.client_name,
            clientPhone: booking.client_phone,
            amountPaid: booking.amount_paid,
            amountPending: booking.amount_pending,
            notes: booking.notes
        }
    }))
}

export async function markAsPaid(bookingId: number, totalAmount: number) {
    const { error } = await supabase.from('bookings').update({ status: 'paid_full', amount_paid: totalAmount, amount_pending: 0 }).eq('id', bookingId)
    if (error) return { success: false }
    revalidatePath('/admin/calendar')
    return { success: true }
}

export async function cancelBooking(bookingId: number) {
    const { error } = await supabase.from('bookings').delete().eq('id', bookingId)
    if (error) return { success: false }
    revalidatePath('/admin/calendar')
    return { success: true }
}