// ./src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";

// Variables de entorno
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID2;
const IMPERSONATE_USER = process.env.GOOGLE_IMPERSONATE_USER;

type GaxiosLikeError = {
    response?: {
        data?: unknown;
    };
};

export async function POST(req: NextRequest) {
    console.log("🚀🚀🚀 ¡LA PETICIÓN ENTRÓ AL SERVIDOR! 🚀🚀🚀");

    try {
        if (!CLIENT_EMAIL || !PRIVATE_KEY || !FOLDER_ID || !IMPERSONATE_USER) {
            return NextResponse.json({ error: "Server Misconfiguration" }, { status: 500 });
        }

        // 1) Procesar el archivo
        const formData = await req.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        // 2) Autenticación con JWT + Subject (impersonación)
        const auth = new google.auth.JWT({
            email: CLIENT_EMAIL,
            key: PRIVATE_KEY.replace(/\\n/g, "\n"),
            scopes: ["https://www.googleapis.com/auth/drive"],
            subject: IMPERSONATE_USER,
        });

        await auth.authorize();

        const drive = google.drive({ version: "v3", auth });

        // 3) Subir archivo
        const response = await drive.files.create({
            requestBody: {
                name: file.name,
                mimeType: "application/pdf",
                parents: [FOLDER_ID],
            },
            media: {
                mimeType: "application/pdf",
                body: stream,
            },
            supportsAllDrives: true,
            fields: "id, name, webViewLink, owners",
        });

        console.log("Archivo subido. Dueño:", response.data.owners?.[0]?.emailAddress);

        return NextResponse.json({ success: true, fileId: response.data.id });
    } catch (error: unknown) {
        console.log("🔴🔴🔴 --- INICIO DEL ERROR --- 🔴🔴🔴");

        console.error("El error original es:", error);

        const maybeGaxios = error as GaxiosLikeError;

        if (maybeGaxios.response?.data) {
            console.error("🔥 DETALLE DE GOOGLE (LO IMPORTANTE):");
            console.error(JSON.stringify(maybeGaxios.response.data, null, 2));
        } else {
            const message = error instanceof Error ? error.message : String(error);
            console.error("🔥 MENSAJE:", message);
        }

        console.log("🔴🔴🔴 --- FIN DEL ERROR --- 🔴🔴🔴");

        const message = error instanceof Error ? error.message : String(error);

        return NextResponse.json(
            {
                error: "Revisa la terminal de VS Code para ver el error real",
                originalError: message,
            },
            { status: 500 }
        );
    }
}
