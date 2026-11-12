"use client";

import { useEffect } from "react";

// Analytics + advertising tags, per the fleet consent standard ("Dr Dev setup",
// Lora + Callum, 11 Nov 2026):
//   - GTM + GA4 load on EVERY page for EVERY visitor, not behind the banner. The
//     Consent Mode v2 default (src/app/lib/consent.ts, first script in <head>)
//     already grants analytics_storage (denied only for "Turn off analytics
//     cookies") and denies ad_storage / ad_user_data / ad_personalization until
//     Accept, so GA4 measures with analytics cookies only.
//   - GA4 is configured HERE only (the GTM container has GA4 event tags but no
//     Google tag / config tag), with Google signals and ad-personalisation off.
//   - The Meta Pixel (if NEXT_PUBLIC_META_PIXEL_ID is ever set) stays consent-gated:
//     it loads only once the visitor accepts (CookieConsent sets
//     window.__OLDHAM_CONSENT__ and dispatches 'oldham-consent').
//
// GTM + GA4 are served FIRST-PARTY via Google Tag Gateway (GTG): the loaders point
// at the same-origin /v2ur path, which vercel.json rewrites to gtm-trc7lx45.fps.goog.
// This dodges Safari/ITP third-party blocking (~11% better signal per Google).
//   - GTM loader  → /v2ur?id=GTM-…            (Mode A / trailingSlash:false form)
//   - gtag loader → /v2ur/gtag/js?id=G-…       (GTG mirrors Google's /gtag/js path)
//
// NOTE: do NOT use a bare "/v2ur/" for gtag. With trailingSlash:false Next.js
// 308-redirects it to "/v2ur", and it carries no ?id=, so GA4 never configures.
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "G-FGG9MW14XY";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-TRC7LX45";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID; // FLAG: none on the current live site

// First-party GTG measurement path (rewritten in vercel.json).
const GTG_GTM_SRC = "/v2ur?id=";
const GTG_GTAG_SRC = "/v2ur/gtag/js?id=";

// QA affordance: ?ga_debug=1 marks this browser's hits with GA4's debug_mode
// parameter (sticky; ?ga_debug=0 clears it). Useful for picking your own test
// traffic out of Realtime and the standard reports.
//
// It does NOT make GA4's DebugView work. Verified 2026-09-11: gtag emits this
// as an event parameter (ep.debug_mode=true), while DebugView only honours the
// separate _dbg=1 flag, and hits carrying _dbg=1 through the Tag Gateway
// (/v2ur) did not surface either. For live tag debugging use GTM Preview mode
// or the Realtime report, both of which work correctly on this site.
function ga4DebugEnabled(): boolean {
  try {
    const q = new URLSearchParams(window.location.search).get("ga_debug");
    if (q === "1") { localStorage.setItem("ga_debug", "1"); return true; }
    if (q === "0") { localStorage.removeItem("ga_debug"); return false; }
    return localStorage.getItem("ga_debug") === "1";
  } catch { return false; }
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; callMethod?: (...a: unknown[]) => void; loaded?: boolean; version?: string; push?: unknown };
    _fbq?: unknown;
  }
}

export default function Analytics() {
  // GTM + GA4: every visitor, every page (consent default is already set in <head>).
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      // gtag must push the `arguments` object itself, not a rest-parameter array.
      // eslint-disable-next-line prefer-rest-params
      window.gtag = function gtag() { window.dataLayer!.push(arguments); };
    }

    // Google Tag Manager (first-party via GTG)
    if (GTM_ID && !document.querySelector(`script[src="${GTG_GTM_SRC + GTM_ID}"]`)) {
      window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      const g = document.createElement("script");
      g.async = true;
      g.src = GTG_GTM_SRC + GTM_ID;
      document.head.appendChild(g);
    }

    // GA4 direct gtag config (first-party via GTG) — the ONLY place GA4 is configured.
    if (GA4_ID && !document.querySelector(`script[src="${GTG_GTAG_SRC + GA4_ID}"]`)) {
      const s = document.createElement("script");
      s.async = true;
      s.src = GTG_GTAG_SRC + GA4_ID;
      document.head.appendChild(s);
      window.gtag("js", new Date());
      // debug_mode also flags GA4 event tags fired by GTM, since they share
      // this same G-… tag instance.
      window.gtag("config", GA4_ID, {
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        ...(ga4DebugEnabled() ? { debug_mode: true } : {}),
      });
    }
  }, []);

  // Advertising tags: consent-gated, load only after "Accept all".
  useEffect(() => {
    let loaded = false;

    function loadAds() {
      if (loaded || window.__OLDHAM_CONSENT__ !== "accepted") return;
      loaded = true;

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

    if (window.__OLDHAM_CONSENT__ === "accepted") loadAds();
    const handler = (e: Event) => { if ((e as CustomEvent).detail === "accepted") loadAds(); };
    window.addEventListener("oldham-consent", handler);
    return () => window.removeEventListener("oldham-consent", handler);
  }, []);

  return null;
}
