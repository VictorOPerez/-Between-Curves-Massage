// src/lib/googleCalendar.ts
import { google } from 'googleapis';

const {
    GOOGLE_CALENDAR_CLIENT_ID,
    GOOGLE_CALENDAR_CLIENT_SECRET,
    GOOGLE_CALENDAR_REFRESH_TOKEN,
    GOOGLE_CALENDAR_ID,
    GOOGLE_CALENDAR_TZ,
} = process.env;

if (
    !GOOGLE_CALENDAR_CLIENT_ID ||
    !GOOGLE_CALENDAR_CLIENT_SECRET ||
    !GOOGLE_CALENDAR_REFRESH_TOKEN ||
    !GOOGLE_CALENDAR_ID
) {
    console.warn(
        '[GoogleCalendar] Faltan variables de entorno, Calendar no estará activo.'
    );
}

const oauth2Client =
    GOOGLE_CALENDAR_CLIENT_ID &&
        GOOGLE_CALENDAR_CLIENT_SECRET &&
        GOOGLE_CALENDAR_REFRESH_TOKEN
        ? new google.auth.OAuth2(
            GOOGLE_CALENDAR_CLIENT_ID,
            GOOGLE_CALENDAR_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground'
        )
        : null;

if (oauth2Client && GOOGLE_CALENDAR_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
        refresh_token: GOOGLE_CALENDAR_REFRESH_TOKEN,
    });
}

const calendar =
    oauth2Client && GOOGLE_CALENDAR_ID
        ? google.calendar({ version: 'v3', auth: oauth2Client })
        : null;

const DEFAULT_TZ = GOOGLE_CALENDAR_TZ || 'America/New_York';

// 🎨 Estado → colorId
export function statusToColorId(status: string): string | undefined {
    switch (status) {
        case 'confirmed_stripe':
            return '5';  // amarillo (10%)
        case 'confirmed_trust':
            return '4';  // rojo/naranja
        case 'paid_full':
            return '2';  // verde
        case 'completed':
            return '10'; // azul fuerte
        default:
            return undefined;
    }
}

export interface CalendarEventInput {
    summary: string;
    description?: string;
    start: Date;
    end: Date;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    colorId?: string;
}

export async function createGoogleCalendarEvent(
    input: CalendarEventInput
): Promise<{ success: boolean; eventId?: string; error?: string }> {
    try {
        if (!calendar || !GOOGLE_CALENDAR_ID) {
            return {
                success: false,
                error: 'Google Calendar no está configurado correctamente',
            };
        }

        const event = {
            summary: input.summary,
            description:
                input.description ??
                `Cliente: ${input.clientName}\nEmail: ${input.clientEmail}${input.clientPhone ? `\nTeléfono: ${input.clientPhone}` : ''
                }`,
            start: {
                dateTime: input.start.toISOString(),
                timeZone: DEFAULT_TZ,
            },
            end: {
                dateTime: input.end.toISOString(),
                timeZone: DEFAULT_TZ,
            },
            attendees: [
                {
                    email: input.clientEmail,
                    displayName: input.clientName,
                },
            ],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 },
                    { method: 'popup', minutes: 60 },
                ],
            },
            colorId: input.colorId,
        };

        const res = await calendar.events.insert({
            calendarId: GOOGLE_CALENDAR_ID,
            requestBody: event,
        });

        return { success: true, eventId: res.data.id ?? undefined };
    } catch (err) {
        console.error('[GoogleCalendar] Error creando evento:', err);
        const errorMessage =
            err instanceof Error ? err.message : 'Unknown calendar error';
        return { success: false, error: errorMessage };
    }
}


// Actualizar solo el color de un evento existente
export async function updateGoogleEventColor(
    eventId: string,
    colorId?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        if (!calendar || !GOOGLE_CALENDAR_ID) {
            return {
                success: false,
                error: 'Google Calendar no está configurado correctamente',
            };
        }

        await calendar.events.patch({
            calendarId: GOOGLE_CALENDAR_ID,
            eventId,
            requestBody: { colorId },
        });

        return { success: true };
    } catch (err) {
        console.error('[GoogleCalendar] Error actualizando color:', err);
        const msg = err instanceof Error ? err.message : 'Unknown calendar error';
        return { success: false, error: msg };
    }
}

// Borrar el evento de Google Calendar (para cancelaciones)
export async function deleteGoogleEvent(
    eventId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        if (!calendar || !GOOGLE_CALENDAR_ID) {
            return {
                success: false,
                error: 'Google Calendar no está configurado correctamente',
            };
        }

        await calendar.events.delete({
            calendarId: GOOGLE_CALENDAR_ID,
            eventId,
        });

        return { success: true };
    } catch (err) {
        console.error('[GoogleCalendar] Error borrando evento:', err);
        const msg = err instanceof Error ? err.message : 'Unknown calendar error';
        return { success: false, error: msg };
    }
}
