export async function getGbpAccessToken() {
    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: process.env.GBP_CLIENT_ID!,
            client_secret: process.env.GBP_CLIENT_SECRET!,
            refresh_token: process.env.GBP_REFRESH_TOKEN!,
            grant_type: 'refresh_token',
        }),
    })

    if (!res.ok) throw new Error(`GBP token refresh failed: ${await res.text()}`)
    const json = await res.json()
    return json.access_token as string
}
