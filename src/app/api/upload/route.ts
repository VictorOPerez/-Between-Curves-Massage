import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

// Variables de entorno
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID2;
// NUEVO: El usuario real al que vamos a "imitar"
const IMPERSONATE_USER = process.env.GOOGLE_IMPERSONATE_USER;

export async function POST(req: NextRequest) {
    console.log("🚀🚀🚀 ¡LA PETICIÓN ENTRÓ AL SERVIDOR! 🚀🚀🚀");
    try {
        // Validamos que exista la variable del usuario a impersonar
        if (!CLIENT_EMAIL || !PRIVATE_KEY || !FOLDER_ID || !IMPERSONATE_USER) {
            return NextResponse.json({ error: 'Server Misconfiguration' }, { status: 500 });
        }

        // 1. Procesar el archivo (Igual que antes)
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

        // ---------------------------------------------------------
        // 2. CAMBIO CRÍTICO: Autenticación con JWT + Subject
        // ---------------------------------------------------------
        // Cambiamos 'GoogleAuth' por 'JWT' para poder usar 'subject'

        const auth = new google.auth.JWT({
            email: CLIENT_EMAIL,
            key: PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: [
                'https://www.googleapis.com/auth/drive',
                // Si en el futuro quieres agregar Calendar, lo pones aquí:
                // 'https://www.googleapis.com/auth/calendar'
            ],
            subject: IMPERSONATE_USER, // <--- LA MAGIA: Aquí le dices "Actúa como este humano"
        });

        // NOTA: Con JWT no necesitas pasar 'auth' dentro de google.drive({ auth }) 
        // de la misma forma, pero es más seguro autorizar primero:
        await auth.authorize();

        const drive = google.drive({ version: 'v3', auth });

        // ---------------------------------------------------------

        // 3. Subir archivo (Igual que antes)
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
            fields: 'id, name, webViewLink, owners', // Agregué 'owners' para que verifiques quién es el dueño
        });

        // Tip: En el log verás quién quedó como dueño
        console.log("Archivo subido. Dueño:", response.data.owners?.[0]?.emailAddress);

        return NextResponse.json({ success: true, fileId: response.data.id });

    } catch (error: any) {
        console.log("🔴🔴🔴 --- INICIO DEL ERROR --- 🔴🔴🔴");

        // 1. Imprime el error crudo
        console.error("El error original es:", error);

        // 2. Si es un error de axios/google (GaxiosError), intenta sacar la data interna
        if (error.response && error.response.data) {
            console.error("🔥 DETALLE DE GOOGLE (LO IMPORTANTE):");
            console.error(JSON.stringify(error.response.data, null, 2));
        } else {
            // 3. Si es otro tipo de error
            console.error("🔥 MENSAJE:", error.message);
        }

        console.log("🔴🔴🔴 --- FIN DEL ERROR --- 🔴🔴🔴");

        // Devolvemos algo al frontend para que no salga {}
        return NextResponse.json({
            error: "Revisa la terminal de VS Code para ver el error real",
            originalError: error.message
        }, { status: 500 });
    }
}