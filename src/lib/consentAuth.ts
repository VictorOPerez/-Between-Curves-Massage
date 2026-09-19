import { createHash, createHmac, timingSafeEqual } from "crypto";
import type { NextRequest, NextResponse } from "next/server";

export const CONSENT_COOKIE_NAME = "consent_access";
const SESSION_SECONDS = 8 * 60 * 60;

function safeEqual(left: string, right: string) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function signExpiration(expiresAt: string, secret: string) {
    return createHmac("sha256", secret).update(expiresAt).digest("hex");
}

export function consentAuthIsConfigured() {
    return Boolean(process.env.CONSENT_LINK_TOKEN_HASH && process.env.CONSENT_SESSION_SECRET);
}

export function verifyConsentLinkToken(token: string) {
    const expectedHash = process.env.CONSENT_LINK_TOKEN_HASH;
    if (!expectedHash) return false;

    const suppliedHash = createHash("sha256").update(token, "utf8").digest("hex");
    return safeEqual(suppliedHash, expectedHash.trim().toLowerCase());
}

export function hasValidConsentSession(req: NextRequest) {
    const secret = process.env.CONSENT_SESSION_SECRET;
    const cookie = req.cookies.get(CONSENT_COOKIE_NAME)?.value;
    if (!secret || !cookie) return false;

    const [expiresAt, signature] = cookie.split(".");
    if (!expiresAt || !signature || Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false;

    return safeEqual(signature, signExpiration(expiresAt, secret));
}

export function setConsentSessionCookie(response: NextResponse) {
    const secret = process.env.CONSENT_SESSION_SECRET;
    if (!secret) throw new Error("CONSENT_SESSION_SECRET is not configured");

    const expiresAt = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
    const signature = signExpiration(expiresAt, secret);

    response.cookies.set(CONSENT_COOKIE_NAME, `${expiresAt}.${signature}`, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_SECONDS,
    });
}

export function clearConsentSessionCookie(response: NextResponse) {
    response.cookies.set(CONSENT_COOKIE_NAME, "", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    });
}
