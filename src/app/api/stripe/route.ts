import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { createGoogleCalendarEvent, statusToColorId } from "@/lib/googleCalendar";
import { sendBookingNotifications } from "@/lib/notifications";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error(`Webhook Error: ${msg}`);
        return NextResponse.json({ error: msg }, { status: 400 });
    }

    if (event.type !== "checkout.session.completed") {
        return NextResponse.json({ received: true });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // ✅ Idempotency key (Stripe retry-safe)
    const stripeSessionId = session.id;
    const stripePaymentIntentId = session.payment_intent?.toString() || null;

    // 1) Datos del cliente desde Stripe
    const clientEmail = session.customer_details?.email || "No email";
    const clientName = session.customer_details?.name || "Cliente Web";
    const clientPhone = session.customer_details?.phone || "";

    // 2) Datos de la cita desde metadata
    const metadata = session.metadata || {};
    const startTime = new Date(metadata.startTime as string);
    const endTime = new Date(metadata.endTime as string);
    const amountTotal = parseFloat(metadata.amountTotal as string);
    const amountPaid = parseFloat(metadata.amountPaid as string);

    // Validación mínima para evitar NaN/Invalid Date
    if (!metadata.serviceId || !metadata.serviceName || isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        console.error("Webhook metadata inválida:", metadata);
        return NextResponse.json({ error: "Invalid metadata" }, { status: 400 });
    }

    // 3) Buscar si ya procesamos esta sesión (Stripe reintenta webhooks)
    const existing = await prisma.booking.findUnique({
        where: { stripeSessionId },
        select: { id: true, googleEventId: true, stripeNotifiedAt: true },
    });

    let bookingId: number;
    let googleEventId: string | null = null;
    let notifiedAt: Date | null = null;

    if (existing) {
        bookingId = existing.id;
        googleEventId = existing.googleEventId;
        notifiedAt = existing.stripeNotifiedAt;
    } else {
        // 4) Crear booking (solo 1 vez)
        const created = await prisma.booking.create({
            data: {
                serviceId: metadata.serviceId as string,
                serviceName: metadata.serviceName as string,
                clientName,
                clientEmail,
                clientPhone: clientPhone || null,
                startTime,
                endTime,
                amountTotal,
                amountPaid,
                amountPending: amountTotal - amountPaid,
                status: "confirmed_stripe",
                notes: `Pago Stripe ID: ${stripePaymentIntentId ?? ""}`,
                stripeSessionId,
                stripePaymentIntentId,
            },
            select: { id: true, googleEventId: true, stripeNotifiedAt: true },
        });

        bookingId = created.id;
        googleEventId = created.googleEventId;
        notifiedAt = created.stripeNotifiedAt;
    }

    // 5) Crear evento en Google Calendar SOLO si falta googleEventId (retry-safe)
    if (!googleEventId) {
        try {
            const colorId = statusToColorId("confirmed_stripe");

            const calendarResult = await createGoogleCalendarEvent({
                summary: `${clientName} – ${metadata.serviceName}`,
                description:
                    `Cliente: ${clientName}\n` +
                    `Email: ${clientEmail}\n` +
                    (clientPhone ? `Teléfono: ${clientPhone}\n` : "") +
                    `Total: $${amountTotal.toFixed(2)}\n` +
                    `Depósito: $${amountPaid.toFixed(2)}\n` +
                    `Stripe session: ${stripeSessionId}\n` +
                    `Stripe payment: ${stripePaymentIntentId ?? ""}`,
                start: startTime,
                end: endTime,
                clientName,
                clientEmail,
                clientPhone,
                colorId,
            });

            if (calendarResult.success && calendarResult.eventId) {
                await prisma.booking.update({
                    where: { id: bookingId },
                    data: { googleEventId: calendarResult.eventId },
                });
                googleEventId = calendarResult.eventId;
            }
        } catch (err) {
            console.error("❌ Error creando evento en Google Calendar:", err);
            // no rompemos el flujo
        }
    }

    // 6) Notificaciones SOLO si no se han enviado (retry-safe)
    if (!notifiedAt) {
        const dateStr = startTime.toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
        });

        const timeStr = startTime.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
        });

        await sendBookingNotifications(
            clientEmail,
            clientName,
            dateStr,
            timeStr,
            metadata.serviceName as string,
            amountPaid
        );

        await prisma.booking.update({
            where: { id: bookingId },
            data: { stripeNotifiedAt: new Date() },
        });
    }

    return NextResponse.json({ received: true });
}
