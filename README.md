# Sanjeev Gupta – Portfolio Site

Static site in `public/`, served by a Cloudflare Worker (`src/index.js`) that also
handles the contact form at `POST /api/contact` and emails each enquiry via
Cloudflare Email Routing.

## Local development

```sh
npm install
npm run dev        # http://localhost:8787 – emails are simulated and logged, not sent
```

## One-time Cloudflare setup (contact form)

1. **Email Routing** – Dashboard → domain → Email → Email Routing → enable.
2. **Destination address** – add `sanjeev70.gupta@gmail.com` and click the
   verification link Cloudflare emails to it.
3. **Sender address** – `CONTACT_FROM` in `wrangler.jsonc` must be on the domain
   with Email Routing enabled (default `contact@coachsanjeevgupta.in`).
4. **Turnstile (recommended)** – create a widget for the domain, then:
   - put the *site key* in `data-turnstile-sitekey` on the form in `public/contact.html`
   - store the *secret key*: `npx wrangler secret put TURNSTILE_SECRET`

   Turnstile is enforced only once the secret exists, so the form keeps working before this step.

## Deploy

```sh
npm run deploy
```
