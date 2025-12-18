import { google } from 'googleapis';

const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const IMPERSONATE_USER = process.env.GOOGLE_IMPERSONATE_USER;

// Esta función es la que importarás en otros lados
export async function sendEmail(to: string, subject: string, htmlBody: string) {
    try {
        if (!CLIENT_EMAIL || !PRIVATE_KEY || !IMPERSONATE_USER) {
            throw new Error('Faltan credenciales de Gmail en .env');
        }

        // 1. Autenticación
        const auth = new google.auth.JWT({
            email: CLIENT_EMAIL,
            key: PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/gmail.send'],
            subject: IMPERSONATE_USER,
        });

        const gmail = google.gmail({ version: 'v1', auth });

        // 2. Construir el mensaje
        const emailLines = [
            `To: ${to}`,
            `From: "Curves Massages" <${IMPERSONATE_USER}>`,
            `Subject: ${subject}`,
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            '',
            htmlBody
        ];
        const emailRaw = emailLines.join('\r\n');

        // 3. Codificar
        const encodedMessage = Buffer.from(emailRaw)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        // 4. Enviar
        await gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw: encodedMessage },
        });

        console.log(`✅ Email enviado a: ${to}`);
        return true;

    } catch (error) {
        console.error('❌ Error enviando email:', error);
        // No lanzamos error para no romper el flujo de reserva si falla el email,
        // pero podrías hacerlo si prefieres.
        return false;
    }
}