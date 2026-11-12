"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CONSENT_KEY, readConsent, type ConsentChoice } from "../lib/consent";

// Cookie consent banner — fleet consent standard ("Dr Dev setup", 11 Nov 2026).
//
// Analytics (GTM + GA4) runs for every visitor without consent; the choice here is
// about ADVERTISING. Decline = no ads (analytics stays on). "Turn off analytics
// cookies" records "deny_all", the visitor's simple way to object to analytics too.
// The Consent Mode v2 default is set in <head> from the same stored value (see
// src/app/lib/consent.ts), so the stored choice applies before any Google tag loads.
//
// On Accept: sends the Google consent update, then exposes the choice on
// window.__OLDHAM_CONSENT__ + an 'oldham-consent' event so Analytics.tsx can load
// the consent-gated tags (Meta Pixel).
//
// Footer "Cookie settings" (any element with `data-cookie-settings`) reopens it,
// so consent can be withdrawn as easily as it was given.

declare global {
  interface Window {
    __OLDHAM_CONSENT__?: ConsentChoice;
  }
}

// On withdrawal, remove the cookies the visitor no longer agrees to: advertising
// cookies always, and analytics cookies too when they turn analytics off. GA sets
// its cookies on the parent domain (.oldhamorthodontics.co.uk), so clear both forms.
// Google's consent is set back to denied FIRST: otherwise GA4 rewrites its session
// cookie as the page unloads for the reload.
function clearTrackingCookies(includeAnalytics: boolean) {
  window.gtag?.("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    ...(includeAnalytics ? { analytics_storage: "denied" } : {}),
  });
  const parent = "." + location.hostname.replace(/^www\./, "");
  const names = includeAnalytics ? /^(_ga|_gid|_gcl|_fbp|_fbc)/ : /^(_gcl|_fbp|_fbc)/;
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (!names.test(name)) return;
    const expired = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = expired;
    document.cookie = `${expired}; domain=${parent}`;
  });
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [reopened, setReopened] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      window.__OLDHAM_CONSENT__ = stored;
    } else {
      // localStorage only exists in the browser, so the banner can only be shown
      // after mount (rendering it on the server would mismatch on hydration).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
    }

    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (t && t.closest("[data-cookie-settings]")) {
        e.preventDefault();
        setReopened(true);
        setShow(true);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // When reopened from the footer link, move focus into the banner.
  useEffect(() => {
    if (show && reopened) bannerRef.current?.focus();
  }, [show, reopened]);

  const choose = useCallback((choice: ConsentChoice) => {
    const before = readConsent();
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {}
    window.__OLDHAM_CONSENT__ = choice;
    setShow(false);
    setReopened(false);

    if (choice === "accepted") {
      window.gtag?.("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
      window.dispatchEvent(new CustomEvent("oldham-consent", { detail: choice }));
      return;
    }
    // A first-time Decline needs nothing: this page already runs as "declined"
    // (analytics on, ads off). Any other change means tags on this page are
    // running in a state the visitor no longer wants, so clear the relevant
    // cookies and reload into the new state.
    if (before === choice || (before === null && choice === "declined")) return;
    clearTrackingCookies(choice === "deny_all");
    location.reload();
  }, []);

  if (!show) return null;

  return (
    <div
      ref={bannerRef}
      className="cookie-consent"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      tabIndex={-1}
    >
      <p className="cookie-consent-text">
        <strong>We use cookies.</strong> Analytics cookies help us understand how our site is used,
        and only produce statistics. With your permission we&rsquo;d also like to use advertising
        cookies to measure our ads. See our <a href="/cookies-policy">Cookies Policy</a> and{" "}
        <a href="/privacy-policy">Privacy Policy</a>.{" "}
        <button type="button" className="cookie-consent-link" onClick={() => choose("deny_all")}>
          Turn off analytics cookies
        </button>
      </p>
      <div className="cookie-consent-actions">
        <button type="button" className="cookie-btn cookie-btn-decline" onClick={() => choose("declined")}>
          Decline advertising
        </button>
        <button type="button" className="cookie-btn cookie-btn-accept" onClick={() => choose("accepted")}>
          Accept all
        </button>
      </div>
    </div>
  );
}
