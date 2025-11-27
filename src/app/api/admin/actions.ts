'use server'
import {
  createGoogleCalendarEvent,
  statusToColorId,
  updateGoogleEventColor,
  deleteGoogleEvent,
} from '@/lib/googleCalendar'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { SERVICES_DB } from '@/lib/services'
import { addMinutes, setHours, setMinutes, isBefore, startOfDay, endOfDay, parseISO } from 'date-fns'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {})

const COOKIE_NAME = process.env.COOKIE_NAME || 'admin_session'
const PASSWORD = process.env.ADMIN_PASSWORD

// Estado que devuelve la acción de login
type LoginState = {
  message?: string
}

export async function loginAction(
  prevState: LoginState | null | undefined,
  formData: FormData
  // 👇 ELIMINADO "| void". Ahora solo devuelve Promise<LoginState>
): Promise<LoginState> {
  const passwordInput = formData.get('password') as string

  // Simular latencia
  await new Promise(resolve => setTimeout(resolve, 500))

  if (passwordInput === PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, passwordInput, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    // redirect() lanza un error interno ("throws"), por lo que técnicamente
    // nunca se retorna nada aquí, lo cual es compatible con TypeScript 
    // siempre que no definas explícitamente "void" en la firma.
    redirect('/admin/calendar')
  }

  // Si llega aquí, devolvemos el estado de error
  return { message: 'PIN incorrecto. Intenta de nuevo.' }
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
      if (isBefore(endTimeLimit, potentialEnd)) break

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
        slots.push(
          currentTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        )
      }
      currentTime = addMinutes(currentTime, TIME_SLOT_INTERVAL)
    }

    return { success: true, slots }
  } catch (error: unknown) {
    console.error('Error calculando slots:', error)
    return { success: false, slots: [] }
  }
}

// --- 1. CREAR SESIÓN STRIPE (Para el Cliente Web) ---
export async function createStripeSession(data: {
  serviceId: string
  serviceName: string
  startTime: Date
  endTime: Date
  amountTotal: number
  amountPaid: number
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
              description: `Reserva para el ${data.startTime.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })} a las ${data.startTime.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}`,
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

    return { success: true as const, url: session.url }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown error while creating Stripe session'
    console.error('Error Stripe:', error)
    return { success: false as const, error: message }
  }
}

export async function createBooking(data: {
  serviceId: string
  serviceName: string
  clientName: string
  clientEmail: string
  clientPhone: string
  startTime: Date
  endTime: Date
  amountTotal: number
  amountPaid: number
}) {
  try {
    // 1) Guardar en BD
    const { data: inserted, error } = await supabase
      .from('bookings')
      .insert({
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
        status: 'confirmed_trust', // reserva manual sin pago
        notes: 'Reserva Manual desde Admin',
      })
      .select('id')
      .single()

    if (error || !inserted) throw new Error(error?.message ?? 'Insert failed')

    const bookingId = inserted.id

    // 2) Crear evento en Google Calendar
    try {
      const colorId = statusToColorId('confirmed_trust')

      const calendarResult = await createGoogleCalendarEvent({
        summary: `${data.clientName} – ${data.serviceName}`,
        description:
          `Cliente: ${data.clientName}\n` +
          `Email: ${data.clientEmail}\n` +
          (data.clientPhone ? `Teléfono: ${data.clientPhone}\n` : '') +
          `Total: $${data.amountTotal.toFixed(2)}\n` +
          `Depósito: $${data.amountPaid.toFixed(2)}`,
        start: data.startTime,
        end: data.endTime,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        colorId,
      })

      if (calendarResult.success && calendarResult.eventId) {
        await supabase
          .from('bookings')
          .update({ google_event_id: calendarResult.eventId })
          .eq('id', bookingId)
      }
    } catch (err) {
      console.error('Error creando evento de calendario para reserva manual:', err)
      // No hacemos throw: la reserva en BD sigue siendo válida
    }

    revalidatePath('/admin/calendar')
    return { success: true as const }
  } catch (error: unknown) {
    console.error('Error creando reserva manual:', error)
    const message =
      error instanceof Error ? error.message : 'Unknown error while creating manual booking'
    return { success: false as const, error: message }
  }
}


// --- ADMINISTRACIÓN ---
// Define la estructura de los datos que vienen de Supabase
interface BookingRow {
  id: number
  start_time: string
  end_time: string
  client_name: string
  service_name: string
  status: string
  client_phone: string | null
  amount_paid: number
  amount_pending: number
  notes: string | null
}

export async function fetchBookings() {
  // 1. Obtenemos los datos (Supabase a veces devuelve 'any' si no tienes tipos generados)
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('start_time', { ascending: true })

  if (error || !data) return []

  // 2. Aquí usamos la interfaz 'BookingRow' en lugar de 'any'
  return data.map((booking: BookingRow) => ({
    id: booking.id,
    title: `${booking.client_name} - ${booking.service_name}`,
    start: new Date(booking.start_time),
    end: new Date(booking.end_time),
    resource: {
      status: booking.status,
      clientName: booking.client_name,
      clientPhone: booking.client_phone || '', // Manejamos si viene null
      amountPaid: booking.amount_paid,
      amountPending: booking.amount_pending,
      notes: booking.notes || '', // Manejamos si viene null
    },
  }))
}
export async function markAsPaid(bookingId: number, totalAmount: number) {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      status: 'paid_full',
      amount_paid: totalAmount,
      amount_pending: 0,
    })
    .eq('id', bookingId)
    .select('google_event_id')
    .single()

  if (error) return { success: false as const }

  // Actualizar color en Google Calendar → verde (paid_full)
  if (data?.google_event_id) {
    const colorId = statusToColorId('paid_full')
    await updateGoogleEventColor(data.google_event_id, colorId)
  }

  revalidatePath('/admin/calendar')
  return { success: true as const }
}


export async function cancelBooking(bookingId: number) {
  // 1) Leer google_event_id antes de borrar
  const { data } = await supabase
    .from('bookings')
    .select('google_event_id')
    .eq('id', bookingId)
    .single()

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId)

  if (error) return { success: false as const }

  // 2) Borrar también en Google Calendar
  if (data?.google_event_id) {
    await deleteGoogleEvent(data.google_event_id)
  }

  revalidatePath('/admin/calendar')
  return { success: true as const }
}
