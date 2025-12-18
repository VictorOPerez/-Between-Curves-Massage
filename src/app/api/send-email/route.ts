import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Mismas variables que ya tienes
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
// Este usuario será el REMITENTE (quien envía el correo)
const IMPERSONATE_USER = process.env.GOOGLE_IMPERSONATE_USER;

export async function POST(req: NextRequest) {
    try {
        const { to, subject, messageBody } = await req.json();

        // 1. Configurar la autenticación (IGUAL QUE EN DRIVE)
        const auth = new google.auth.JWT({
            email: CLIENT_EMAIL,
            key: PRIVATE_KEY?.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/gmail.send'], // Scope de Gmail
            subject: IMPERSONATE_USER, // El correo saldrá de: admin@curvesmassages.com
        });

        const gmail = google.gmail({ version: 'v1', auth });

        // 2. Construir el correo "Crudo" (MIME Message)
        // Esto es necesario para que Gmail entienda saltos de línea, asunto, etc.
        const emailLines = [
            `To: ${to}`,
            `From: "Curves Massages" <${IMPERSONATE_USER}>`, // Puedes ponerle un nombre bonito
            `Subject: ${subject}`,
            'Content-Type: text/html; charset=utf-8', // Para poder usar HTML y tildes
            'MIME-Version: 1.0',
            '',
            messageBody // Aquí va tu HTML o texto
        ];

        const emailRaw = emailLines.join('\r\n');

        // 3. Codificar a Base64URL (Requisito de Google)
        const encodedMessage = Buffer.from(emailRaw)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        // 4. Enviar
        const response = await gmail.users.messages.send({
            userId: 'me', // 'me' se refiere al usuario impersonado
            requestBody: {
                raw: encodedMessage,
            },
        });

        return NextResponse.json({ success: true, id: response.data.id });

    } catch (error: any) {
        console.error('Gmail API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}