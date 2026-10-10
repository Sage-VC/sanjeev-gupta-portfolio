/**
 * Worker for coachsanjeevgupta.in
 *
 * Static pages are served from the ASSETS binding. The only dynamic route is
 * POST /api/contact, which validates the contact form and emails it to Sanjeev
 * via Cloudflare Email Routing (send_email binding).
 */

const LIMITS = { name: 120, email: 254, organisation: 200, message: 5000 };
const INTENTS = {
  myself: 'For Myself',
  organisation: 'For My Organisation',
  other: 'Something Else',
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' });
      }
      return handleContact(request, env);
    }

    if (url.pathname.startsWith('/api/')) {
      return json({ ok: false, error: 'Not found.' }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  // Only accept submissions from our own pages.
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) {
    return json({ ok: false, error: 'Forbidden.' }, 403);
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (env.CONTACT_RATE_LIMITER) {
    const { success } = await env.CONTACT_RATE_LIMITER.limit({ key: ip });
    if (!success) {
      return json({ ok: false, error: 'Too many submissions. Please try again in a minute.' }, 429);
    }
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  const fields = {
    intent: INTENTS[data.intent] || INTENTS.other,
    name: clean(data.name, LIMITS.name),
    email: clean(data.email, LIMITS.email),
    organisation: clean(data.organisation, LIMITS.organisation),
    message: clean(data.message, LIMITS.message, true),
  };

  if (!fields.name || !fields.email || !fields.message) {
    return json({ ok: false, error: 'Please complete the required fields (Name, Email, and Message).' }, 400);
  }
  if (!EMAIL_RE.test(fields.email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  }

  // Turnstile is enforced once TURNSTILE_SECRET is set as a Worker secret.
  if (env.TURNSTILE_SECRET) {
    const valid = await verifyTurnstile(data.turnstileToken, ip, env.TURNSTILE_SECRET);
    if (!valid) {
      return json({ ok: false, error: 'Verification failed. Please refresh the page and try again.' }, 400);
    }
  }

  try {
    await env.CONTACT_EMAIL.send({
      from: { email: env.CONTACT_FROM, name: 'Website Contact Form' },
      to: env.CONTACT_TO,
      replyTo: { email: fields.email, name: fields.name },
      subject: `New enquiry from ${fields.name} (${fields.intent})`,
      text: renderText(fields),
      html: renderHtml(fields),
    });
  } catch (err) {
    console.error('Contact email failed', err?.code, err?.message);
    return json({ ok: false, error: 'Sorry, your message could not be sent. Please email directly instead.' }, 502);
  }

  return json({ ok: true });
}

async function verifyTurnstile(token, ip, secret) {
  if (typeof token !== 'string' || !token) return false;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  body.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const outcome = await res.json();
    return outcome.success === true;
  } catch (err) {
    console.error('Turnstile verification error', err?.message);
    return false;
  }
}

/** Trim, cap length and strip control characters (keeping newlines when multiline). */
function clean(value, max, multiline = false) {
  if (typeof value !== 'string') return '';
  const pattern = multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return value.replace(pattern, ' ').trim().slice(0, max);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderText(f) {
  return [
    'New enquiry from the website contact form',
    '',
    `Reaching out: ${f.intent}`,
    `Name: ${f.name}`,
    `Email: ${f.email}`,
    `Organisation / Role: ${f.organisation || '-'}`,
    '',
    'Message:',
    f.message,
    '',
    '-- Reply to this email to respond directly to the sender.',
  ].join('\n');
}

function renderHtml(f) {
  const row = (label, value) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;vertical-align:top;white-space:nowrap">${label}</td>` +
    `<td style="padding:6px 0;color:#0F1D36">${value}</td></tr>`;
  const email = escapeHtml(f.email);
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#0F1D36;max-width:600px">
  <h2 style="margin:0 0 16px;font-size:18px;border-bottom:2px solid #C5A880;padding-bottom:8px">New enquiry from the website</h2>
  <table style="border-collapse:collapse;margin-bottom:16px">
    ${row('Reaching out', escapeHtml(f.intent))}
    ${row('Name', escapeHtml(f.name))}
    ${row('Email', `<a href="mailto:${email}">${email}</a>`)}
    ${row('Organisation / Role', escapeHtml(f.organisation || '-'))}
  </table>
  <div style="background:#F8F6F0;border:1px solid #C5A880;border-radius:8px;padding:16px;white-space:pre-wrap">${escapeHtml(f.message)}</div>
  <p style="color:#6b7280;font-size:13px;margin-top:16px">Reply to this email to respond directly to ${escapeHtml(f.name)}.</p>
</div>`;
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });
}
