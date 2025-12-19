// src/lib/gmail.ts
import "server-only";
import { google } from "googleapis";

const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const IMPERSONATE_USER = process.env.GOOGLE_IMPERSONATE_USER;

/**
 * Encodes a header value using RFC 2047 (UTF-8, Base64) so subjects with
 * accents/emojis render correctly in all email clients.
 *
 * Example output: =?UTF-8?B?....?=
 */
function encodeHeaderRFC2047(value: string): string {
    const b64 = Buffer.from(value, "utf8").toString("base64");
    // Optional folding (safe for long subjects)
    const chunks = b64.match(/.{1,52}/g) ?? [b64];
    return chunks.map((c) => `=?UTF-8?B?${c}?=`).join("\r\n ");
}

function getGmailClient() {
    if (!CLIENT_EMAIL || !PRIVATE_KEY || !IMPERSONATE_USER) return null;

    const auth = new google.auth.JWT({
        email: CLIENT_EMAIL,
        key: PRIVATE_KEY.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/gmail.send"],
        subject: IMPERSONATE_USER,
    });

    const gmail = google.gmail({ version: "v1", auth });
    return { auth, gmail };
}

// This is the function you import elsewhere
export async function sendEmail(to: string, subject: string, htmlBody: string) {
    try {
        const client = getGmailClient();
        if (!client) {
            throw new Error("Missing Gmail credentials in env (GOOGLE_CLIENT_EMAIL/PRIVATE_KEY/IMPERSONATE_USER).");
        }

        // Ensure we have a fresh access token
        await client.auth.authorize();

        // ✅ Encode subject so accents/emojis don't break (RFC 2047)
        const subjectHeader = encodeHeaderRFC2047(subject);

        // (Optional) If you ever put accents/emojis in the From display name, encode it too.
        // Here it's ASCII, so no need. Left as-is.
        const fromHeader = `"Curves Massages" <${IMPERSONATE_USER}>`;

        // Build RFC 5322 raw message
        const emailLines = [
            `To: ${to}`,
            `From: ${fromHeader}`,
            `Subject: ${subjectHeader}`,
            "MIME-Version: 1.0",
            'Content-Type: text/html; charset="UTF-8"',
            "Content-Transfer-Encoding: 8bit",
            "",
            htmlBody,
        ];

        const emailRaw = emailLines.join("\r\n");

        // Base64url encode (required by Gmail API)
        const encodedMessage = Buffer.from(emailRaw, "utf8")
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        await client.gmail.users.messages.send({
            userId: "me",
            requestBody: { raw: encodedMessage },
        });

        console.log(`✅ Email sent to: ${to}`);
        return true;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        return false;
    }
}
