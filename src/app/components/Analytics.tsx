"use client";

import { useEffect } from "react";

// Consent-gated analytics. Fires GTM + GA4 + (optional) Meta Pixel ONLY after the
// visitor accepts cookies (CookieConsent sets window.__OLDHAM_CONSENT__ and
// dispatches 'oldham-consent'). Nothing loads before consent.
//
// GTM + GA4 are served FIRST-PARTY via Google Tag Gateway (GTG): the loaders point
// at the same-origin /v2ur path, which vercel.json rewrites to gtm-trc7lx45.fps.goog.
// This dodges Safari/ITP third-party blocking (~11% better signal per Google).
//   - GTM loader  → /v2ur?id=GTM-…   (Mode A / trailingSlash:false form)
//   - gtag loader → /v2ur/            (Google's gtag endpoint; needs the trailing slash)
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "G-9JGC66CELX";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-TRC7LX45";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID; // FLAG: none on the current live site

// First-party GTG measurement path (rewritten in vercel.json).
const GTG_GTM_SRC = "/v2ur?id=";
const GTG_GTAG_SRC = "/v2ur/";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; callMethod?: (...a: unknown[]) => void; loaded?: boolean; version?: string; push?: unknown };
    _fbq?: unknown;
  }
}

export default function Analytics() {
  useEffect(() => {
    let loaded = false;

    function load() {
      if (loaded || window.__OLDHAM_CONSENT__ !== "accepted") return;
      loaded = true;

      window.dataLayer = window.dataLayer || [];

      // Google Tag Manager (first-party via GTG)
      if (GTM_ID) {
        window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        const g = document.createElement("script");
        g.async = true;
        g.src = GTG_GTM_SRC + GTM_ID;
        document.head.appendChild(g);
      }

      // GA4 direct gtag config (first-party via GTG)
      if (GA4_ID) {
        const s = document.createElement("script");
        s.async = true;
        s.src = GTG_GTAG_SRC;
        document.head.appendChild(s);
        window.gtag = function gtag() { window.dataLayer!.push(arguments); };
        window.gtag("js", new Date());
        window.gtag("config", GA4_ID);
      }

      // Meta Pixel
      if (META_PIXEL_ID) {
        /* eslint-disable */
        (function (f: any, b, e, v, n?: any, t?: any, s?: any) {
          if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
          if (!f._fbq) f._fbq = n; n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
          t = b.createElement(e); t.async = true; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
        })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
        /* eslint-enable */
        window.fbq!("init", META_PIXEL_ID);
        window.fbq!("track", "PageView");
      }
    }

    if (window.__OLDHAM_CONSENT__ === "accepted") load();
    const handler = (e: Event) => { if ((e as CustomEvent).detail === "accepted") load(); };
    window.addEventListener("oldham-consent", handler);
    return () => window.removeEventListener("oldham-consent", handler);
  }, []);

  return null;
}
