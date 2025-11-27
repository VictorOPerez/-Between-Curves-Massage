// src/app/api/test-calendar/route.ts
import { NextResponse } from 'next/server';
import { createGoogleCalendarEvent } from '@/lib/googleCalendar';

export async function GET() {
    const now = new Date();
    const end = new Date(now.getTime() + 60 * 60 * 1000); // +1h

    const result = await createGoogleCalendarEvent({
        summary: 'TEST – No atender',
        start: now,
        end,
        clientName: 'Prueba Sistema',
        clientEmail: 'test@example.com',
    });

    return NextResponse.json(result);
}
