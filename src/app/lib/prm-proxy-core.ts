/**
 * prm-proxy-core.ts — shared logic for the Next.js serverless PRM form proxy.
 *
 * Purpose: keep the TDS-API-KEY out of the browser entirely. The site's forms
 * POST same-origin to /api/prm/* WITHOUT any key; the route handler attaches the
 * key (a server-side Vercel env var, never shipped to the browser) and forwards
 * the request to prm.tio.work. PRM is untouched.
 *
 *   [Browser form] ── POST, NO key ──▶ [/api/prm/* handler] ── + TDS-API-KEY ──▶ [prm.tio.work]
 *
 * This mirrors carousel-orthodontics-au's server/prm-proxy-core.js, adapted for
 * a normal (non-static-export) Next.js app where App Router route handlers build
 * and run natively on Vercel — no root api/ dir needed.
 *
 * Endpoints (one route handler each under src/app/api/prm/, an explicit
 * allowlist by construction — nothing else is routable):
 *
 *   POST /api/prm/xcms-to-prm-v4-tds   → https://prm.tio.work/api/xcms-to-prm-v4-tds
 *   POST /api/prm/html-to-pdf/generate → https://prm.tio.work/api/html-to-pdf/generate
 *   POST /api/prm/v2/upload-file       → https://prm.tio.work/api/v2/upload-file
 *
 * The query string is preserved verbatim (belt-and-braces for Laravel's input()).
 *
 * Config (Vercel project env vars — server-side, NOT NEXT_PUBLIC_):
 *   TDS_API_KEY               — the scoped submission key. Required; the proxy
 *                               fails LOUDLY (500) if unset rather than forwarding
 *                               keyless and letting PRM 401 ambiguously.
 *   PRM_PROXY_ALLOWED_ORIGINS — OPTIONAL comma-separated extra Origin allowlist.
 *                               Same-origin requests (Origin host === serving host)
 *                               are always allowed, which covers the production
 *                               domain AND every Vercel preview URL automatically.
 *                               NOTE: origin checks only gate BROWSERS — curl can
 *                               fake Origin. That's fine: the point of this proxy
 *                               is hiding the key, not authenticating callers
 *                               (PRM's key check still runs downstream).
 */

const PRM_BASE = "https://prm.tio.work/api";

function corsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

// Returns the request's Origin if it's allowed, else null. Browsers send Origin
// on every POST; a request with no/unknown Origin is refused (curl → 403 — the
// deploy-verification probe relies on this).
function allowedOrigin(request: Request): string | null {
  const origin = request.headers.get("origin") || "";
  if (!origin) return null;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return null;
  }
  // Same-origin: the forms post to their own domain, so the Origin's host matches
  // the host this handler is served on (x-forwarded-host is set by Vercel's edge
  // and not client-controllable through it).
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";
  if (originHost && originHost === host) return origin;
  const extra = (process.env.PRM_PROXY_ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  if (extra.includes(origin)) return origin;
  return null;
}

// Preflight (only hit cross-origin — same-origin posts never preflight; kept for
// parity with the carousel Worker/proxy and any future shared-proxy use).
export function preflight(request: Request): Response {
  const origin = allowedOrigin(request);
  if (!origin) return new Response(null, { status: 403 });
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function proxyToPrm(
  request: Request,
  apiPath: string,
): Promise<Response> {
  const origin = allowedOrigin(request);
  if (!origin) {
    return new Response("Forbidden", { status: 403 });
  }

  if (!process.env.TDS_API_KEY) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "proxy misconfigured: TDS_API_KEY env var not set",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      },
    );
  }

  // Forward body + Content-Type verbatim (urlencoded ajax forms AND multipart PDF/
  // upload forms — the multipart boundary lives in the Content-Type header, keep it
  // intact). Bodies are buffered: form payloads are small, well inside limits.
  const search = new URL(request.url).search;
  const target = PRM_BASE + apiPath + search;
  const headers: Record<string, string> = {
    "TDS-API-KEY": process.env.TDS_API_KEY,
  };
  const contentType = request.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;
  const body = Buffer.from(await request.arrayBuffer());

  const prmRes = await fetch(target, { method: "POST", headers, body });

  // Pass PRM's response through as-is (status + body) so the site-side callers
  // (formSubmit.ts) behave identically to a direct PRM call.
  const resHeaders: Record<string, string> = { ...corsHeaders(origin) };
  const resContentType = prmRes.headers.get("content-type");
  if (resContentType) resHeaders["Content-Type"] = resContentType;
  return new Response(prmRes.body, {
    status: prmRes.status,
    headers: resHeaders,
  });
}
