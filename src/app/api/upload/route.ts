import { randomUUID } from "crypto";
import { Readable } from "stream";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { hasValidConsentSession } from "@/lib/consentAuth";
import { CONSENT_MAX_PDF_BYTES, CONSENT_VERSION } from "@/lib/consentConstants";
import { AESTHETICS_CONSENT_VERSION } from "@/lib/aestheticsConsent";

const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID2;
const IMPERSONATE_USER = process.env.GOOGLE_IMPERSONATE_USER;

type GaxiosLikeError = {
    response?: {
        data?: unknown;
    };
};

const uploads = new Map<string, { count: number; resetAt: number }>();
const UPLOAD_WINDOW_MS = 60 * 60 * 1000;
const MAX_UPLOADS_PER_WINDOW = 10;

function clientAddress(req: NextRequest) {
    return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function uploadLimitReached(req: NextRequest) {
    const key = clientAddress(req);
    const now = Date.now();
    const current = uploads.get(key);

    if (!current || current.resetAt <= now) {
        uploads.set(key, { count: 1, resetAt: now + UPLOAD_WINDOW_MS });
        return false;
    }

    current.count += 1;
    return current.count > MAX_UPLOADS_PER_WINDOW;
}

function cleanClientName(value: FormDataEntryValue | null) {
    if (typeof value !== "string") return "Client";

    const cleaned = value
        .normalize("NFKD")
        .replace(/[^a-zA-Z0-9 -]/g, "")
        .trim()
        .replace(/\s+/g, "_");

    return cleaned.slice(0, 60) || "Client";
}

export async function POST(req: NextRequest) {
    try {
        if (!hasValidConsentSession(req)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (uploadLimitReached(req)) {
            return NextResponse.json({ error: "Upload limit reached" }, { status: 429 });
        }

        if (!CLIENT_EMAIL || !PRIVATE_KEY || !FOLDER_ID) {
            return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
        }

        const formData = await req.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        if (file.type !== "application/pdf" || file.size < 5 || file.size > CONSENT_MAX_PDF_BYTES) {
            return NextResponse.json({ error: "Invalid PDF" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (buffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
            return NextResponse.json({ error: "Invalid PDF" }, { status: 400 });
        }

        const clientName = cleanClientName(formData.get("clientName"));
        const requestedType = formData.get("consentType");
        const consentType = requestedType === "aesthetics" ? "aesthetics" : "massage";
        const language = formData.get("language") === "en" ? "en" : "es";
        const documentVersion = consentType === "aesthetics" ? AESTHETICS_CONSENT_VERSION : CONSENT_VERSION;
        const receivedAt = new Date();
        const timestamp = receivedAt.toISOString().replace(/[:.]/g, "-");
        const consentId = randomUUID();
        const serverFileName = `BCM_${consentType === "aesthetics" ? "Aesthetics" : "Massage"}_Consent_${clientName}_${timestamp}_${consentId.slice(0, 8)}.pdf`;

        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        const auth = new google.auth.JWT({
            email: CLIENT_EMAIL,
            key: PRIVATE_KEY.replace(/\\n/g, "\n"),
            scopes: ["https://www.googleapis.com/auth/drive"],
            ...(IMPERSONATE_USER ? { subject: IMPERSONATE_USER } : {}),
        });

        await auth.authorize();
        const drive = google.drive({ version: "v3", auth });

        const response = await drive.files.create({
            requestBody: {
                name: serverFileName,
                mimeType: "application/pdf",
                parents: [FOLDER_ID],
                description: `Between Curves ${consentType} consent ${documentVersion}; received ${receivedAt.toISOString()}; id ${consentId}`,
                appProperties: {
                    consentId,
                    consentType,
                    consentVersion: documentVersion,
                    language,
                    receivedAt: receivedAt.toISOString(),
                },
            },
            media: {
                mimeType: "application/pdf",
                body: stream,
            },
            supportsAllDrives: true,
            fields: "id, name",
        });

        return NextResponse.json({
            success: true,
            fileId: response.data.id,
            fileName: response.data.name,
            consentId,
            receivedAt: receivedAt.toISOString(),
        });
    } catch (error: unknown) {
        const maybeGaxios = error as GaxiosLikeError;

        if (maybeGaxios.response?.data) {
            console.error("Google Drive consent upload failed:", maybeGaxios.response.data);
        } else {
            console.error("Consent upload failed:", error instanceof Error ? error.message : String(error));
        }

        return NextResponse.json({ error: "Unable to save consent" }, { status: 500 });
    }
}
