import { NextRequest, NextResponse } from "next/server";
import {
    consentAuthIsConfigured,
    setConsentSessionCookie,
    verifyConsentLinkToken,
} from "@/lib/consentAuth";

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token") || "";

    if (!consentAuthIsConfigured() || token.length > 128 || !verifyConsentLinkToken(token)) {
        return NextResponse.redirect(new URL("/consent?invalid=1", req.url));
    }

    const response = NextResponse.redirect(new URL("/consent", req.url));
    setConsentSessionCookie(response);
    return response;
}
