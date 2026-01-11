import { NextResponse } from 'next/server'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
    const redirectUri = `${baseUrl}/api/gbp/callback`

    const params = new URLSearchParams({
        client_id: process.env.GBP_CLIENT_ID!,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/business.manage',
        access_type: 'offline',
        prompt: 'consent',
        include_granted_scopes: 'true',
    })

    return NextResponse.redirect(
        `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    )
}
