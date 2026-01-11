'use server'

import {
  createGoogleCalendarEvent,
  statusToColorId,
  updateGoogleEventColor,
  deleteGoogleEvent,
} from '@/lib/googleCalendar'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { SERVICES_DB } from '@/lib/services'
import { addMinutes, setHours, setMinutes, isBefore, startOfDay, endOfDay, parseISO } from 'date-fns'
import Stripe from 'stripe'
import { getGbpAccessToken } from '@/lib/gbpAuth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {})

const COOKIE_NAME = process.env.COOKIE_NAME || 'admin_session'
const PASSWORD = process.env.ADMIN_PASSWORD

type LoginState = { message?: string }

export async function loginAction(
  prevState: LoginState | null | undefined,
  formData: FormData
): Promise<LoginState> {
  const passwordInput = formData.get('password') as string

  await new Promise(resolve => setTimeout(resolve, 500))

  if (passwordInput === PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, passwordInput, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    redirect('/admin/calendar')
  }

  return { message: 'PIN incorrecto. Intenta de nuevo.' }
}

// --- LÓGICA DE DISPONIBILIDAD ---
type BusySlot = { startTime: Date; endTime: Date }

export async function getAvailableSlots(dateStr: string, serviceId: string) {
  try {
    const WORK_START_HOUR = 9
    const WORK_END_HOUR = 19
    const TIME_SLOT_INTERVAL = 30

    const service = SERVICES_DB[serviceId]
    if (!service) throw new Error('Servicio no encontrado')
    const duration = service.durationMin

    const searchDate = parseISO(dateStr)
    const dayStart = startOfDay(searchDate)
    const dayEnd = endOfDay(searchDate)

    const bookings: BusySlot[] = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      select: { startTime: true, endTime: true },
    })

    const slots: string[] = []
    let currentTime = setMinutes(setHours(searchDate, WORK_START_HOUR), 0)
    const endTimeLimit = setMinutes(setHours(searchDate, WORK_END_HOUR), 0)

    while (isBefore(currentTime, endTimeLimit)) {
      const potentialEnd = addMinutes(currentTime, duration)
      if (isBefore(endTimeLimit, potentialEnd)) break

      const isOccupied = bookings.some(b => {
        const bookingStart = new Date(b.startTime)
        const bookingEnd = new Date(b.endTime)
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
    const message = error instanceof Error ? error.message : 'Unknown error while creating Stripe session'
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
    // 1) Guardar en BD (Neon vía Prisma)
    const inserted = await prisma.booking.create({
      data: {
        serviceId: data.serviceId,
        serviceName: data.serviceName,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone || null,
        startTime: data.startTime,
        endTime: data.endTime,
        amountTotal: data.amountTotal,
        amountPaid: data.amountPaid,
        amountPending: data.amountTotal - data.amountPaid,
        status: 'confirmed_trust',
        notes: 'Reserva Manual desde Admin',
      },
      select: { id: true },
    })

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
        await prisma.booking.update({
          where: { id: bookingId },
          data: { googleEventId: calendarResult.eventId },
        })
      }
    } catch (err) {
      console.error('Error creando evento de calendario para reserva manual:', err)
    }

    revalidatePath('/admin/calendar')
    return { success: true as const }
  } catch (error: unknown) {
    console.error('Error creando reserva manual:', error)
    const message = error instanceof Error ? error.message : 'Unknown error while creating manual booking'
    return { success: false as const, error: message }
  }
}

export async function fetchBookings() {
  const data = await prisma.booking.findMany({
    orderBy: { startTime: 'asc' },
  })
  type BookingRow = (typeof data)[number]
  return data.map((booking: BookingRow) => ({
    id: booking.id,
    title: `${booking.clientName} - ${booking.serviceName}`,
    start: new Date(booking.startTime),
    end: new Date(booking.endTime),
    resource: {
      status: booking.status,
      clientName: booking.clientName,
      clientPhone: booking.clientPhone || '',
      amountPaid: booking.amountPaid,
      amountPending: booking.amountPending,
      notes: booking.notes || '',
    },
  }))
}

export async function markAsPaid(bookingId: number, totalAmount: number) {
  try {
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'paid_full',
        amountPaid: totalAmount,
        amountPending: 0,
      },
      select: { googleEventId: true },
    })

    if (updated.googleEventId) {
      const colorId = statusToColorId('paid_full')
      await updateGoogleEventColor(updated.googleEventId, colorId)
    }

    revalidatePath('/admin/calendar')
    return { success: true as const }
  } catch (e) {
    console.error('markAsPaid error:', e)
    return { success: false as const }
  }
}

export async function cancelBooking(bookingId: number) {
  try {
    // 1) Leer googleEventId antes de borrar
    const found = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { googleEventId: true },
    })

    // 2) Borrar en BD
    await prisma.booking.delete({ where: { id: bookingId } })

    // 3) Borrar también en Google Calendar
    if (found?.googleEventId) {
      await deleteGoogleEvent(found.googleEventId)
    }

    revalidatePath('/admin/calendar')
    return { success: true as const }
  } catch (e) {
    console.error('cancelBooking error:', e)
    return { success: false as const }
  }
}



let _cache: { at: number; data: unknown } | null = null

export async function gbpListAccounts(): Promise<unknown> {
  if (_cache && Date.now() - _cache.at < 60_000) return _cache.data

  const token = await getGbpAccessToken()
  const r = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store',
  })

  const text = await r.text()
  if (!r.ok) throw new Error(`GBP accounts error ${r.status}: ${text.slice(0, 500)}`)

  const data: unknown = JSON.parse(text)
  _cache = { at: Date.now(), data }
  return data
}
