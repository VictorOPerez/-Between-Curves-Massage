// src/lib/googleCalendar.ts
import { google } from "googleapis";

// ✅ Reutilizamos las mismas env vars que usas en Drive/Gmail
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const IMPERSONATE_USER = process.env.GOOGLE_IMPERSONATE_USER;

// Puede ser "primary" o el email del calendar owner, o un calendarId específico compartido
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";
const DEFAULT_TZ = process.env.GOOGLE_CALENDAR_TZ || "America/New_York";

// Scope recomendado (completo para evitar problemas con patch/delete/guests)
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

// Cache (para no re-crear clientes en cada llamada)
let _auth: InstanceType<typeof google.auth.JWT> | null = null;
let _calendar: ReturnType<typeof google.calendar> | null = null;

function getCalendarClient() {
    if (!CLIENT_EMAIL || !PRIVATE_KEY || !IMPERSONATE_USER) return null;

    if (!_auth) {
        _auth = new google.auth.JWT({
            email: CLIENT_EMAIL,
            key: PRIVATE_KEY.replace(/\\n/g, "\n"),
            scopes: SCOPES,
            subject: IMPERSONATE_USER, // ✅ impersonación
        });
    }

    if (!_calendar) {
        _calendar = google.calendar({ version: "v3", auth: _auth });
    }

    return { auth: _auth, calendar: _calendar };
}

// 🎨 Estado → colorId
export function statusToColorId(status: string): string | undefined {
    switch (status) {
        case "confirmed_stripe":
            return "5"; // amarillo (10%)
        case "confirmed_trust":
            return "4"; // rojo/naranja
        case "paid_full":
            return "2"; // verde
        case "completed":
            return "10"; // azul fuerte
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
        const client = getCalendarClient();
        if (!client) {
            return { success: false, error: "Google Calendar no está configurado (env missing)" };
        }

        // ✅ Autoriza JWT (importante)
        await client.auth.authorize();

        const event = {
            summary: input.summary,
            description:
                input.description ??
                `Cliente: ${input.clientName}\nEmail: ${input.clientEmail}${input.clientPhone ? `\nTeléfono: ${input.clientPhone}` : ""
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
                    { method: "email", minutes: 24 * 60 },
                    { method: "popup", minutes: 60 },
                ],
            },
            colorId: input.colorId,
        };

        const res = await client.calendar.events.insert({
            calendarId: GOOGLE_CALENDAR_ID,
            requestBody: event,
            // Si quieres que Google mande invitación al cliente (opcional):
            // sendUpdates: "all",
        });

        return { success: true, eventId: res.data.id ?? undefined };
    } catch (err) {
        console.error("[GoogleCalendar] Error creando evento:", err);
        const msg = err instanceof Error ? err.message : "Unknown calendar error";
        return { success: false, error: msg };
    }
}

export async function updateGoogleEventColor(
    eventId: string,
    colorId?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const client = getCalendarClient();
        if (!client) {
            return { success: false, error: "Google Calendar no está configurado (env missing)" };
        }

        await client.auth.authorize();

        await client.calendar.events.patch({
            calendarId: GOOGLE_CALENDAR_ID,
            eventId,
            requestBody: { colorId },
        });

        return { success: true };
    } catch (err) {
        console.error("[GoogleCalendar] Error actualizando color:", err);
        const msg = err instanceof Error ? err.message : "Unknown calendar error";
        return { success: false, error: msg };
    }
}

export async function deleteGoogleEvent(
    eventId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const client = getCalendarClient();
        if (!client) {
            return { success: false, error: "Google Calendar no está configurado (env missing)" };
        }

        await client.auth.authorize();

        await client.calendar.events.delete({
            calendarId: GOOGLE_CALENDAR_ID,
            eventId,
        });

        return { success: true };
    } catch (err) {
        console.error("[GoogleCalendar] Error borrando evento:", err);
        const msg = err instanceof Error ? err.message : "Unknown calendar error";
        return { success: false, error: msg };
    }
}
