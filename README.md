This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Protected consent form

The `/consent` form and `/api/upload` endpoint require a server-validated private link. Configure these environment variables locally and in the deployment provider:

```env
CONSENT_LINK_TOKEN_HASH=<sha256 hash of the private link token>
CONSENT_SESSION_SECRET=<long random signing secret>
```

Generate the values without storing the plain access code in the repository:

```powershell
node -e "const c=require('crypto'); const token=c.randomBytes(32).toString('base64url'); console.log('TOKEN='+token); console.log('HASH='+c.createHash('sha256').update(token).digest('hex'))"
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

The first command produces the private token and `CONSENT_LINK_TOKEN_HASH`; the second produces `CONSENT_SESSION_SECRET`. Share `/consent/open?token=TOKEN` with clients. The server validates it, creates the secure session, and immediately redirects to the clean `/consent` URL. After changing either environment value, redeploy the application. Existing consent sessions expire after eight hours and become invalid immediately if the session secret changes.

### Client preview (September 2026)

The `preview/consent-redesign` branch is deployed publicly on Railway at `https://web-production-dbb21.up.railway.app`. The client entry point is `https://web-production-dbb21.up.railway.app/consent/open?token=TOKEN`, where `TOKEN` is the private token corresponding to the deployed `CONSENT_LINK_TOKEN_HASH`. The complete private URL was shared in the project conversation; do not commit the token or complete URL to this repository. The Vercel branch preview requires Vercel sign-in and is not suitable to send to clients.

The link is a reusable bearer link: anyone who receives the complete URL can open the form, even if it is forwarded. It is not tied to an individual client and has no one-use or link-expiration rule. Opening it creates an eight-hour browser session. To revoke the link, rotate `CONSENT_LINK_TOKEN_HASH` and redeploy. Commit `1a03a09` fixes the Railway redirect so successful access stays on the public domain. The live link was checked to redirect to `/consent`, and `/api/consent/access` returned `authorized: true` with its session cookie.

## Google Drive consent storage

Signed massage and aesthetics PDFs are generated in the browser and sent to the protected `/api/upload` backend. The backend validates the session and PDF, creates a server-controlled file name and uploads it to the configured private Drive folder.

```env
GOOGLE_CLIENT_EMAIL=<service-account-email>
GOOGLE_PRIVATE_KEY=<service-account-private-key>
GOOGLE_DRIVE_FOLDER_ID2=<destination-folder-id>
GOOGLE_IMPERSONATE_USER=<optional-workspace-user>
```

Share the destination folder with `GOOGLE_CLIENT_EMAIL`. `GOOGLE_IMPERSONATE_USER` is optional; use it only when the Google Workspace domain has enabled domain-wide delegation for the service account. Each uploaded file includes the consent ID, type, language, document version and reception timestamp as private Drive metadata.
