import { NextRequest, NextResponse } from "next/server";
import { clearConsentSessionCookie, hasValidConsentSession } from "@/lib/consentAuth";

export async function GET(req: NextRequest) {
    return NextResponse.json({ authorized: hasValidConsentSession(req) });
}

export async function DELETE() {
    const response = NextResponse.json({ authorized: false });
    clearConsentSessionCookie(response);
    return response;
}
