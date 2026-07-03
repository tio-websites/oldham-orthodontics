"use client";

import { useEffect } from "react";

// Consent-gated analytics. Fires GA4 (id from env) + Meta Pixel ONLY after the
// visitor accepts cookies (CookieConsent sets window.__OLDHAM_CONSENT__ and
// dispatches 'oldham-consent'). Nothing loads before consent.
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID; // FLAG: supplied by the practice
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID; // FLAG: none on the current live site

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

      // GA4
      if (GA4_ID) {
        const s = document.createElement("script");
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
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
