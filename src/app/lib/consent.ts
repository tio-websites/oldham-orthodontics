// Cookie consent: shared storage key, values and the Consent Mode v2 default.
//
// Fleet consent standard ("Dr Dev setup", Lora + Callum, 11 Nov 2026):
//   - GA4 fires for every visitor on page load (analytics only; it produces statistics).
//   - Decline = advertising off, analytics stays on.
//   - "Turn off analytics cookies" = analytics off too.
//   - ad_storage / ad_user_data / ad_personalization (and any ad pixel) wait for Accept.
//
// The choice lives in localStorage under CONSENT_KEY:
//   "accepted"  Accept all                 (analytics + advertising)
//   "declined"  Decline advertising         (analytics only) — legacy "deny" is read the same way
//   "deny_all"  Turn off analytics cookies  (nothing)
// No value = first visit: behaves as "declined" until the visitor chooses.
export const CONSENT_KEY = "oldham-cookie-consent";

export type ConsentChoice = "accepted" | "declined" | "deny_all";

export function readConsent(): ConsentChoice | null {
  let v: string | null = null;
  try {
    v = localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
  if (v === "accepted" || v === "deny_all") return v;
  if (v === "declined" || v === "deny") return "declined";
  return null;
}

// Rendered as the FIRST script in <head> (layout.tsx), before gtag.js or GTM load.
// Must push `arguments` (not an array) for gtag to read it.
export const consentModeDefault = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
(function () {
  var c = null;
  try { c = localStorage.getItem(${JSON.stringify(CONSENT_KEY)}); } catch (e) {}
  var ok = c === 'accepted', off = c === 'deny_all';
  gtag('consent', 'default', {
    analytics_storage: off ? 'denied' : 'granted',
    ad_storage: ok ? 'granted' : 'denied',
    ad_user_data: ok ? 'granted' : 'denied',
    ad_personalization: ok ? 'granted' : 'denied',
    wait_for_update: 500
  });
  gtag('set', 'url_passthrough', true);
  gtag('set', 'ads_data_redaction', true);
  window.__OLDHAM_CONSENT__ = ok ? 'accepted' : off ? 'deny_all' : (c === 'declined' || c === 'deny') ? 'declined' : undefined;
})();`;
