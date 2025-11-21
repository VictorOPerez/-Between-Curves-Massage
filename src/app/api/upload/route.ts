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

        // 2. Autenticación (Volvemos al Service Account, es mejor para esto)
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: CLIENT_EMAIL,
                private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            // Scope para acceder a archivos
            scopes: ['https://www.googleapis.com/auth/drive'],
        });

        const drive = google.drive({ version: 'v3', auth });

        // 3. Subir archivo CON SOPORTE PARA SHARED DRIVES
        const response = await drive.files.create({
            requestBody: {
                name: file.name,
                mimeType: 'application/pdf',
                parents: [FOLDER_ID], // ID de la carpeta compartida
            },
            media: {
                mimeType: 'application/pdf',
                body: stream,
            },
            //ESTAS DOS LINEAS SON LA SOLUCION MAGICA:
            supportsAllDrives: true,
            fields: 'id, name, webViewLink',
        });

        return NextResponse.json({ success: true, fileId: response.data.id });

    } catch (error: any) {
        console.error('Google Drive Error:', error);
        // Esto nos dará más detalles en la consola si falla
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}