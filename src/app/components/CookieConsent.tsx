"use client";

import { useEffect, useState } from "react";

// Cookie consent banner for new visitors. Persists the choice to localStorage
// and exposes it on window + an 'oldham-consent' event so analytics/marketing
// scripts (GA4, Meta Pixel) can gate on consent (they must NOT fire until accept).
const KEY = "oldham-cookie-consent";

declare global {
  interface Window {
    __OLDHAM_CONSENT__?: "accepted" | "declined";
  }
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored === "accepted" || stored === "declined") {
      window.__OLDHAM_CONSENT__ = stored;
    } else {
      setShow(true);
    }
  }, []);

  function choose(choice: "accepted" | "declined") {
    localStorage.setItem(KEY, choice);
    window.__OLDHAM_CONSENT__ = choice;
    window.dispatchEvent(new CustomEvent("oldham-consent", { detail: choice }));
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <p className="cookie-consent-text">
        We use cookies to improve your experience and understand how our site is used. See our{" "}
        <a href="/cookies-policy">Cookies Policy</a> for details.
      </p>
      <div className="cookie-consent-actions">
        <button type="button" className="cookie-btn cookie-btn-decline" onClick={() => choose("declined")}>
          Decline
        </button>
        <button type="button" className="cookie-btn cookie-btn-accept" onClick={() => choose("accepted")}>
          Accept
        </button>
      </div>
    </div>
  );
}
