/* Edge Middleware — password-gates the entire site (pages AND assets,
   including the résumé PDF, which a client-side gate could not protect).
   The password lives in the PORTFOLIO_PASSWORD env var on Vercel; it is
   never present in this repo. A visitor is let through when their cookie
   carries the SHA-256 hash of that password (set by gate.html). */

export const config = {
  // everything except the gate page itself and the favicons it needs
  matcher: ['/((?!gate\\.html|assets/favicon-).*)'],
};

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default async function middleware(req) {
  const password = process.env.PORTFOLIO_PASSWORD;
  // env var not configured: let traffic through rather than locking everyone
  // out with no way to recover (the var is set in the Vercel project settings)
  if (!password) return;

  const cookies = req.headers.get('cookie') || '';
  const m = cookies.match(/(?:^|;\s*)folio_key=([a-f0-9]{64})/);
  if (m && m[1] === (await sha256Hex(password))) return;

  return Response.redirect(new URL('/gate.html', req.url), 307);
}
