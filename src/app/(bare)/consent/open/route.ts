import { NextRequest, NextResponse } from "next/server";
import {
    consentAuthIsConfigured,
    setConsentSessionCookie,
    verifyConsentLinkToken,
} from "@/lib/consentAuth";

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token") || "";

    if (!consentAuthIsConfigured() || token.length > 128 || !verifyConsentLinkToken(token)) {
        return new NextResponse(null, { status: 307, headers: { Location: "/consent?invalid=1" } });
    }

    const response = new NextResponse(null, { status: 307, headers: { Location: "/consent" } });
    setConsentSessionCookie(response);
    return response;
}
