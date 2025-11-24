import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendConfirmationEmail } from '@/lib/email'
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
        // Verificamos si 'err' es realmente un objeto de Error estándar
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';

        console.error(`Webhook Error: ${errorMessage}`)
        return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session

        // 1. EXTRAER DATOS DEL CLIENTE DESDE STRIPE
        const clientEmail = session.customer_details?.email || 'No email'
        const clientName = session.customer_details?.name || 'Cliente Web'
        const clientPhone = session.customer_details?.phone || '' // Stripe captura esto ahora

        // 2. EXTRAER DATOS DE LA CITA DESDE METADATOS
        const metadata = session.metadata || {}
        const startTime = new Date(metadata.startTime)
        const endTime = new Date(metadata.endTime)
        const amountTotal = parseFloat(metadata.amountTotal)
        const amountPaid = parseFloat(metadata.amountPaid)

        console.log(`💰 Pago recibido de: ${clientName} (${clientEmail})`)

        // 3. INSERTAR EN SUPABASE (AHORA SÍ CREAMOS LA RESERVA)
        const { error } = await supabase.from('bookings').insert({
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
            notes: `Pago Stripe ID: ${session.payment_intent}`
        })

        if (error) {
            console.error('Error guardando en BD:', error)
            return NextResponse.json({ error: 'Database failure' }, { status: 500 })
        }

        // 4. ENVIAR EMAIL
        const dateStr = startTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
        const timeStr = startTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

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