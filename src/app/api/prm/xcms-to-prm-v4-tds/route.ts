// POST /api/prm/xcms-to-prm-v4-tds — ajax lead forms (contact, consult, referral).
// Same-origin proxy that injects the server-side TDS-API-KEY. See prm-proxy-core.ts.
import { proxyToPrm, preflight } from "@/app/lib/prm-proxy-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(request: Request) {
  return preflight(request);
}

export function POST(request: Request) {
  return proxyToPrm(request, "/xcms-to-prm-v4-tds");
}
