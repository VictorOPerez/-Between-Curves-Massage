import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

// Variables de entorno
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

export async function POST(req: NextRequest) {
    try {
        if (!CLIENT_EMAIL || !PRIVATE_KEY || !FOLDER_ID) {
            return NextResponse.json({ error: 'Server Misconfiguration' }, { status: 500 });
        }

        // 1. Procesar el archivo
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        // 2. Autenticación (Service Account)
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: CLIENT_EMAIL,
                private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/drive'],
        });

        const drive = google.drive({ version: 'v3', auth });

        // 3. Subir archivo
        const response = await drive.files.create({
            requestBody: {
                name: file.name,
                mimeType: 'application/pdf',
                parents: [FOLDER_ID],
            },
            media: {
                mimeType: 'application/pdf',
                body: stream,
            },
            supportsAllDrives: true,
            fields: 'id, name, webViewLink',
        });

        return NextResponse.json({ success: true, fileId: response.data.id });

    } catch (error: unknown) { // <--- CAMBIO AQUÍ: Usamos 'unknown' en lugar de 'any'
        console.error('Google Drive Error:', error);

        // CAMBIO AQUÍ: Verificamos el tipo de error de forma segura
        let errorMessage = 'Upload failed';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}