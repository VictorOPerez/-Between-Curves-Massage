// src/lib/googleCalendar.ts
import { google } from "googleapis";

const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const IMPERSONATE_USER = process.env.GOOGLE_IMPERSONATE_USER;

const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";
const DEFAULT_TZ = process.env.GOOGLE_CALENDAR_TZ || "America/New_York";

let _auth: InstanceType<typeof google.auth.JWT> | null = null;
let _calendar: ReturnType<typeof google.calendar> | null = null;

function getClient() {
    if (!CLIENT_EMAIL || !PRIVATE_KEY || !IMPERSONATE_USER) return null;

    if (!_auth) {
        _auth = new google.auth.JWT({
            email: CLIENT_EMAIL,
            key: PRIVATE_KEY.replace(/\\n/g, "\n"),
            scopes: ["https://www.googleapis.com/auth/calendar"],
            subject: IMPERSONATE_USER,
        });
    }

    if (!_calendar) {
        _calendar = google.calendar({ version: "v3", auth: _auth });
    }

    return { auth: _auth, calendar: _calendar };
}

export function statusToColorId(status: string): string | undefined {
    switch (status) {
        case "confirmed_stripe":
            return "5";
        case "confirmed_trust":
            return "4";
        case "paid_full":
            return "2";
        case "completed":
            return "10";
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

export async function createGoogleCalendarEvent(input: CalendarEventInput) {
    try {
        const c = getClient();
        if (!c) return { success: false, error: "Google Calendar env missing" as const };

        await c.auth.authorize();

        const res = await c.calendar.events.insert({
            calendarId: GOOGLE_CALENDAR_ID,
            requestBody: {
                summary: input.summary,
                description:
                    input.description ??
                    `Cliente: ${input.clientName}\nEmail: ${input.clientEmail}${input.clientPhone ? `\nTeléfono: ${input.clientPhone}` : ""
                    }`,
                start: { dateTime: input.start.toISOString(), timeZone: DEFAULT_TZ },
                end: { dateTime: input.end.toISOString(), timeZone: DEFAULT_TZ },
                attendees: [{ email: input.clientEmail, displayName: input.clientName }],
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: "email", minutes: 24 * 60 },
                        { method: "popup", minutes: 60 },
                    ],
                },
                colorId: input.colorId,
            },
        });

        return { success: true as const, eventId: res.data.id ?? undefined };
    } catch (err) {
        console.error("[GoogleCalendar] Error creando evento:", err);
        const msg = err instanceof Error ? err.message : String(err);
        return { success: false as const, error: msg };
    }
}

export async function updateGoogleEventColor(eventId: string, colorId?: string) {
    try {
        const c = getClient();
        if (!c) return { success: false, error: "Google Calendar env missing" as const };

        await c.auth.authorize();

        await c.calendar.events.patch({
            calendarId: GOOGLE_CALENDAR_ID,
            eventId,
            requestBody: { colorId },
        });

        return { success: true as const };
    } catch (err) {
        console.error("[GoogleCalendar] Error actualizando color:", err);
        const msg = err instanceof Error ? err.message : String(err);
        return { success: false as const, error: msg };
    }
}

export async function deleteGoogleEvent(eventId: string) {
    try {
        const c = getClient();
        if (!c) return { success: false, error: "Google Calendar env missing" as const };

        await c.auth.authorize();

        await c.calendar.events.delete({
            calendarId: GOOGLE_CALENDAR_ID,
            eventId,
        });

        return { success: true as const };
    } catch (err) {
        console.error("[GoogleCalendar] Error borrando evento:", err);
        const msg = err instanceof Error ? err.message : String(err);
        return { success: false as const, error: msg };
    }
}
