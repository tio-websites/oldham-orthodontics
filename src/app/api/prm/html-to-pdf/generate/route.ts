// POST /api/prm/html-to-pdf/generate — PDF-generating forms (none currently on
// Oldham; wired for parity so future PDF forms need no proxy changes).
// Same-origin proxy that injects the server-side TDS-API-KEY. See prm-proxy-core.ts.
import { proxyToPrm, preflight } from "@/app/lib/prm-proxy-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(request: Request) {
  return preflight(request);
}

export function POST(request: Request) {
  return proxyToPrm(request, "/html-to-pdf/generate");
}
