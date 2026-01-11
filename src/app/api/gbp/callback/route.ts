import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    if (!code) return NextResponse.json({ ok: false, error: 'Missing code' }, { status: 400 })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
    const redirectUri = `${baseUrl}/api/gbp/callback`

    const r = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code,
            client_id: process.env.GBP_CLIENT_ID!,
            client_secret: process.env.GBP_CLIENT_SECRET!,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
        }),
    })

    const tokenJson = await r.json()

    return NextResponse.json({
        ok: r.ok,
        tokenJson,
        hint:
            'Copia tokenJson.refresh_token y ponlo en GBP_REFRESH_TOKEN. Si no aparece, revoca el acceso en myaccount.google.com y repite.',
    })
}
