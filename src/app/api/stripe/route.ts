import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendConfirmationEmail } from '@/lib/email'
import { createGoogleCalendarEvent, statusToColorId } from '@/lib/googleCalendar'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.error(`Webhook Error: ${errorMessage}`)
        return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session

        // 1. Datos del cliente desde Stripe
        const clientEmail = session.customer_details?.email || 'No email'
        const clientName = session.customer_details?.name || 'Cliente Web'
        const clientPhone = session.customer_details?.phone || ''

        // 2. Datos de la cita desde metadata
        const metadata = session.metadata || {}
        const startTime = new Date(metadata.startTime)
        const endTime = new Date(metadata.endTime)
        const amountTotal = parseFloat(metadata.amountTotal)
        const amountPaid = parseFloat(metadata.amountPaid)

        console.log(`💰 Pago recibido de: ${clientName} (${clientEmail})`)

        // 3. Insertar en Supabase
        const { data: inserted, error } = await supabase
            .from('bookings')
            .insert({
                service_id: metadata.serviceId,
                service_name: metadata.serviceName,
                client_name: clientName,
                client_email: clientEmail,
                client_phone: clientPhone,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                amount_total: amountTotal,
                amount_paid: amountPaid,
                amount_pending: amountTotal - amountPaid,
                status: 'confirmed_stripe',
                notes: `Pago Stripe ID: ${session.payment_intent}`,
            })
            .select('id')
            .single()

        if (error || !inserted) {
            console.error('Error guardando en BD:', error)
            return NextResponse.json({ error: 'Database failure' }, { status: 500 })
        }

        const bookingId = inserted.id

        // 4. Crear evento en Google Calendar (amarillo = depósito 10%)
        try {
            const colorId = statusToColorId('confirmed_stripe')

            const calendarResult = await createGoogleCalendarEvent({
                summary: `${clientName} – ${metadata.serviceName}`,
                description:
                    `Cliente: ${clientName}\n` +
                    `Email: ${clientEmail}\n` +
                    (clientPhone ? `Teléfono: ${clientPhone}\n` : '') +
                    `Total: $${amountTotal.toFixed(2)}\n` +
                    `Depósito: $${amountPaid.toFixed(2)}\n` +
                    `Stripe payment: ${session.payment_intent}`,
                start: startTime,
                end: endTime,
                clientName,
                clientEmail,
                clientPhone,
                colorId,
            })

            if (calendarResult.success && calendarResult.eventId) {
                await supabase
                    .from('bookings')
                    .update({ google_event_id: calendarResult.eventId })
                    .eq('id', bookingId)
            }
        } catch (err) {
            console.error('❌ Error creando evento en Google Calendar:', err)
            // No rompemos el flujo: pago y reserva ya están OK
        }

        // 5. Email de confirmación al cliente
        const dateStr = startTime.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        })
        const timeStr = startTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
        })

        await sendConfirmationEmail(
            clientEmail,
            clientName,
            dateStr,
            timeStr,
            metadata.serviceName
        )
    }

    return NextResponse.json({ received: true })
}
