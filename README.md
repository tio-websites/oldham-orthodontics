# Oldham Orthodontics

Next.js website for Oldham Orthodontics, deployed on Vercel.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js (App Router, React, TypeScript) |
| **Styling** | CSS (global + per-page modules) |
| **Lead CRM** | PRM by TIO (account `PENDING — awaiting strategist confirmation`) |
| **Deployment** | Vercel |

## Getting Started

```bash
npm run dev        # http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint check
```

## Architecture — Lead Capture

Patient enquiries are captured by **PRM** (Patient Relationship Manager by TIO). PRM is a receiver — it does not host the forms. Each form POSTs FormData to PRM using the **v4-tds web-form convention** (hidden `wf` field, honeypots, and optional file uploads). PRM then fires email templates, routes leads into the practice inbox, and feeds the dashboard.

**Forms run in PROXIED mode** — they POST *same-origin* to this site's own `/api/prm/*` route handlers, which inject the `TDS-API-KEY` server-side and forward to `prm.tio.work`. The scoped TDS submission key is a **server-side Vercel env var (`TDS_API_KEY`)** and **never ships to the browser**. See `src/app/lib/prm-proxy-core.ts` and `src/app/api/prm/*/route.ts`.

## Forms & PRM Integration

The site has four forms. All four post through the same-origin proxy via one shared submission helper.

> **Status:** `wf` workflow IDs are wired into each form. The free-consultation page and the inline consultation banner share the same workflow. Proxied mode requires `TDS_API_KEY` (server-side), `NEXT_PUBLIC_PRM_PROXY_BASE=/api/prm`, and `NEXT_PUBLIC_PRM_ACCOUNT_ID` set in Vercel (see Environment Variables).

| Form | Page | Component | Workflow ID (`wf`) |
|------|------|-----------|--------------------|
| Contact Enquiry | `/contact` | `src/app/contact/EnquiryForm.tsx` | `wf/nyw6lrrwpd/bdba9cd293355d512336` |
| Free Consultation | `/free-consultation` | `src/app/free-consultation/page.tsx` | `wf/9vwmnqe0xr/bc4c109e526c29e859de` |
| Dentist Referral | `/dentist-referrals` | `src/app/dentist-referrals/ReferralForm.tsx` | `wf/r9zy3p206q/9ebc81c406a16a315785` |
| Inline Consultation Banner | (reusable, used on inner pages) | `src/app/components/inner/ConsultBannerForm.tsx` | `wf/9vwmnqe0xr/bc4c109e526c29e859de` (shared with free-consultation) |

### Shared submission helper

A single helper handles all PRM POSTs so each form only worries about field collection + validation, not transport.

```
src/app/lib/
  formSubmit.ts       # submitPrmForm() + uploadFile()
  validators.ts       # required/email/phone/optionalPhone/postcode/dateOfBirth
```

**`submitPrmForm(form: HTMLFormElement)`**
- Serializes `<form>` to `application/x-www-form-urlencoded`
- **Proxied mode** (default — `NEXT_PUBLIC_PRM_PROXY_BASE` set): POSTs same-origin to `/api/prm/xcms-to-prm-v4-tds` with **no key header** (the proxy adds it). **Direct mode** (fallback): POSTs to `NEXT_PUBLIC_PRM_ENDPOINT` with the `TDS-API-KEY` header.
- Strips honeypot fields before sending; if a honeypot is filled it returns `{ success: true }` silently so bots get a fake-success
- Returns `{ success, error? }` for the caller to redirect or show an error

**`uploadFile(file: File)`** (used by Dentist Referral)
- Uploads each image to `/api/prm/v2/upload-file` (proxied) — or `prm.tio.work/api/v2/upload-file` in direct mode — with the `accountid`
- Returns a hosted URL that the form then submits as a hidden `referral_photo_N` field
- Enforces a 10MB-per-file cap

### The PRM proxy (`/api/prm/*`)

`src/app/lib/prm-proxy-core.ts` is an origin-gated forwarder used by three App Router route handlers:

| Route | Forwards to | Used by |
|---|---|---|
| `src/app/api/prm/xcms-to-prm-v4-tds/route.ts` | `prm.tio.work/api/xcms-to-prm-v4-tds` | all lead forms |
| `src/app/api/prm/v2/upload-file/route.ts` | `prm.tio.work/api/v2/upload-file` | referral photo uploads |
| `src/app/api/prm/html-to-pdf/generate/route.ts` | `prm.tio.work/api/html-to-pdf/generate` | (parity — no PDF forms yet) |

Each handler injects `TDS_API_KEY` (server-side) and passes PRM's status + body back verbatim, so the client behaves identically to a direct PRM call — just without ever seeing the key.

### Per-form hidden fields

Each form includes a standard PRM payload (mirrors TBP's pattern):

```tsx
<input type="hidden" name="accountid" defaultValue={PRM_ACCOUNT_ID} />
<input type="hidden" name="wf" defaultValue={PRM_WEB_FORM} />
<input type="hidden" name="prm-note" value="prm-note" />
<input type="hidden" name="thanks" defaultValue={THANKS_URL} />
<input type="hidden" name="page_name" value="contact" />        {/* per-form */}
<input type="hidden" name="gdpr" value="gdpr" />
<input type="hidden" name="email_subject" value={emailSubject} />
<input type="hidden" name="gdpr_email_subject" value={`${emailSubject} (GDPR)`} />
{/* GDPR email routing: recipient = local_part[0] + '@' + domain[0] */}
<input type="hidden" name="local_part[0]" value={EMAIL_LOCAL_PART} />
<input type="hidden" name="domain[0]" value={EMAIL_DOMAIN} />

{/* UTM attribution — populated by /js/prm-attribution.js on form.ajax_form submit */}
<input type="hidden" name="custom14" defaultValue="" id="fPages" />
<input type="hidden" name="custom15" defaultValue="" id="fContent" />
<input type="hidden" name="custom16" defaultValue="" id="fSource" />
<input type="hidden" name="custom17" defaultValue="" id="fMedium" />
<input type="hidden" name="custom18" defaultValue="" id="fTerm" />
<input type="hidden" name="custom19" defaultValue="" id="fCampaign" />
<input type="hidden" name="custom20" defaultValue="" id="fClientId" />
```

### Honeypots

Every form includes two off-screen honeypot fields with generic names so browser autofill / password managers don't trip them while still catching bots:

```tsx
<div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
  <input type="text" name="oo_hp_a" tabIndex={-1} autoComplete="off" defaultValue="" />
  <input type="text" name="oo_hp_b" tabIndex={-1} autoComplete="off" defaultValue="" />
</div>
```

If either field has a value at submit time, `submitPrmForm()` returns success without contacting PRM.

### Form-specific notes

- **Contact Enquiry** — `subject` dropdown drives the `email_subject` so reception can triage at a glance ("General enquiry", "Question about treatment", "Question about an appointment", "Costs and finance", "Something else"). Optional GDPR routing per subject pending decision (TBP uses this pattern to split new-patient vs existing-patient leads).
- **Free Consultation** — short form (name, email, phone). Single workflow; sends a confirmation email to the patient and a new-lead email to reception.
- **Dentist Referral** — two sections (dentist details + patient details) plus optional clinical photo uploads (max 8). Photos are uploaded to PRM first, then the hosted URLs are submitted as hidden `referral_photo_N` fields. Requires the hidden `dentist_form=1` flag for PRM's GDPR email template to dispatch (matches TBP's Dentist Referral behaviour).
- **Inline Consultation Banner** — `ConsultBannerForm.tsx` is a reusable component dropped into inner pages (treatments, costs, etc). Uses its own `wf` so leads from inner-page banners can be attributed separately if desired.

### GDPR + anti-abuse summary

All forms include:
- Off-screen honeypots (`oo_hp_a`, `oo_hp_b`) — silent fake-success for bots
- GDPR email routing via `local_part[]` / `domain[]` (recipient set per form)
- Per-field blur-time validation with inline error messaging
- UTM attribution passed through hidden `custom14`–`custom20` fields (page, content, source, medium, term, campaign, Google client ID)
- File uploads sized at ≤10MB and gated behind PRM's upload endpoint

## Analytics & Tracking

Consent-gated in `src/app/components/Analytics.tsx` — **nothing fires until the visitor accepts cookies** (`CookieConsent.tsx` sets `window.__OLDHAM_CONSENT__` and dispatches an `oldham-consent` event). On accept, it loads:

| Tag | ID | Notes |
|---|---|---|
| Google Tag Manager | `GTM-TRC7LX45` | container |
| GA4 (gtag) | `G-9JGC66CELX` | direct config, fires alongside GTM |
| Meta Pixel | _(none)_ | only if `NEXT_PUBLIC_META_PIXEL_ID` is set |

Both Google tags load **first-party via Google Tag Gateway (GTG)** — the loaders point at the same-origin `/v2ur` path, which `vercel.json` rewrites to `gtm-trc7lx45.fps.goog` (+ `Host` and `X-Gtg-Developer-Id: dMjAzY2` headers). This dodges Safari/ITP third-party blocking (~11% better signal per Google). Mode A (`trailingSlash:false`): GTM loader → `/v2ur?id=`, gtag loader → `/v2ur/`.

> ⚠️ **Double-count caveat:** GA4 fires both directly (gtag) and could fire again if the GTM container `GTM-TRC7LX45` *also* contains a GA4 tag for `G-9JGC66CELX`. Confirm the container has **no** GA4 tag for that ID, or remove one side.

**GTG post-deploy validation** (all must pass):
```bash
curl -s  "https://oldhamorthodontics.co.uk/v2ur/healthy"    # → ok
curl -s  "https://oldhamorthodontics.co.uk/v2ur/healthy/"   # → ok
curl -sI "https://oldhamorthodontics.co.uk/v2ur/?id=GTM-TRC7LX45"  # → 200 JS, 0 redirects
curl -sI "https://oldhamorthodontics.co.uk/v2ur/"           # → 200 JS (gtag)
```
The GTG origin (`gtm-trc7lx45.fps.goog`) is assumed to follow the standard `gtm-{container-lowercase}.fps.goog` pattern — the health check above confirms it. If it fails, get the real origin from Callum/Datahash.

**Attribution:** `public/js/prm-attribution.js` (from the `prm-custom-attribution-code` skill, GA4 ID `G-9JGC66CELX`) captures UTM/gclid/dclid/referrer + GA4 client_id and writes them into `custom14`–`custom20` on `form.ajax_form` submit. All four PRM forms carry the `ajax_form` class so the script targets them.

## Environment Variables (Vercel)

Set these on the Vercel project (Production **and** Preview):

| Variable | Purpose | Notes |
|---|---|---|
| `TDS_API_KEY` | Scoped TDS submission key, injected by the proxy | **Server-side only — never `NEXT_PUBLIC_`.** From PRM admin → Account → API |
| `NEXT_PUBLIC_PRM_PROXY_BASE` | `/api/prm` — turns on proxied mode | Public, safe |
| `NEXT_PUBLIC_PRM_ACCOUNT_ID` | Numeric PRM account ID (`accountid` field + uploads) | Public. PRM admin → Account |

> 🔒 **Do NOT set `NEXT_PUBLIC_TDS_API_KEY`.** In proxied mode the key lives server-side in `TDS_API_KEY`; a `NEXT_PUBLIC_` copy would be inlined into the browser bundle and defeat the proxy. (Direct-mode fallback only: leave `NEXT_PUBLIC_PRM_PROXY_BASE` blank and set `NEXT_PUBLIC_PRM_ENDPOINT` + `NEXT_PUBLIC_TDS_API_KEY` instead.)

GA4/GTM IDs are hardcoded as safe defaults in `Analytics.tsx`; override via optional `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_GTM_ID` only if the property changes. See `.env.example`.

## What's still needed before go-live

1. **Vercel env vars** (Production + Preview): set `TDS_API_KEY` (server-side), `NEXT_PUBLIC_PRM_PROXY_BASE=/api/prm`, `NEXT_PUBLIC_PRM_ACCOUNT_ID`. **Remove `NEXT_PUBLIC_TDS_API_KEY`** so the key can't be inlined into the bundle.
2. **Confirm the GDPR recipient** — currently `info@oldhamorthodontics.co.uk` (`local_part[0]` + `domain[0]` in each form). Update those constants if it should be a different inbox.
3. **Verify each workflow's action set is configured in PRM** — email templates, notification recipients, GDPR copy address. The Dentist Referral wf requires `dentist_form=1` (already submitted) for the GDPR email template.
4. **Confirm GTM `GTM-TRC7LX45` has no GA4 tag for `G-9JGC66CELX`** (GA4 also fires directly) — else double-count.
5. **End-to-end test on Vercel** (not localhost — PRM CORS/security alerts key off the real domain): submit each form, confirm POST hits `/api/prm/*` with **no `TDS-API-KEY` header**, leads land in PRM + emails arrive, and the referral file upload works.
6. **Validate GTG** post-deploy — run the four curl checks in [Analytics & Tracking](#analytics--tracking); all must pass.
7. **Add the Oldham domains to the Google Maps API allowlist** so the verified business pin renders.
8. **DNS** pointed to Vercel.

Thank-you pages live at `/contact-thank-you`, `/consultation-thank-you`, `/referral-thank-you` and are marked `robots: noindex`.

## Deployment

The site deploys automatically to Vercel on push to `main`.

### Commit identity

Vercel only deploys commits whose author email maps to a GitHub account on the `tio-websites` Vercel team. Confirm:

```bash
git config user.name   # should be "syedalitio"
git config user.email  # should be "syed@growdental.com"
```

## Project Structure

```
vercel.json                         # GTG /v2ur rewrites → gtm-trc7lx45.fps.goog
.env.example                        # env var reference (proxied mode + analytics)
src/app/
  page.tsx                          # Homepage
  layout.tsx                        # Root layout (header, footer, GTM noscript, Analytics, attribution)
  globals.css                       # Global styles
  inner-page.css                    # Inner page shared styles
  contact/
    page.tsx, EnquiryForm.tsx       # Contact form (.ajax_form)
  free-consultation/
    page.tsx, booking.css           # Booking form (.ajax_form)
  dentist-referrals/
    page.tsx, ReferralForm.tsx      # Dentist referral form (.ajax_form) + photo upload
  api/prm/                          # Same-origin PRM proxy (route handlers)
    xcms-to-prm-v4-tds/route.ts
    v2/upload-file/route.ts
    html-to-pdf/generate/route.ts
  components/
    SiteHeader.tsx, SiteFooter.tsx, VisitSection.tsx, ...
    CookieConsent.tsx               # Consent banner (gates analytics)
    Analytics.tsx                   # Consent-gated GTM + GA4 + Meta Pixel via GTG
    inner/
      ConsultBannerForm.tsx         # Reusable inline consultation banner (.ajax_form)
  lib/
    formSubmit.ts                   # Shared PRM submit helper (proxied/direct)
    prm-proxy-core.ts               # Origin-gated proxy forwarder (server-side)
    validators.ts                   # Form field validators
    internal-links.ts, render-policy.tsx
  about-us/, treatments/, results/, costs/, ...
  sitemap.ts, robots.ts, manifest.ts
public/
  js/prm-attribution.js             # PRM/GA4 attribution (feeds custom14–custom20)
  images/, favicon.ico, apple-icon.png
```

## Status

- [x] Homepage + all inner pages built
- [x] Header, footer, navigation
- [x] Forms scaffolded (UI complete, submission stubbed to `console.log`)
- [x] BugHerd feedback widget embedded
- [x] Core Web Vitals + SEO infrastructure
- [x] **PRM `wf` IDs received from strategist**
- [x] **`formSubmit.ts` + `validators.ts` helpers added**
- [x] **Forms wired to PRM** (`submitPrmForm` + per-field validation)
- [x] **Honeypots + UTM hidden fields added to each form**
- [x] **Thank-you pages live** (`/contact-thank-you`, `/consultation-thank-you`, `/referral-thank-you`)
- [x] **PRM proxy (proxied mode)** — forms POST same-origin to `/api/prm/*`; TDS key server-side only
- [x] **Analytics** — consent-gated GTM (`GTM-TRC7LX45`) + GA4 (`G-9JGC66CELX`), first-party via GTG
- [x] **PRM/GA4 attribution** — `/js/prm-attribution.js` feeding `custom14`–`custom20`
- [x] **Dynamic sitemap + robots** audited (all indexable routes, thank-you/template excluded)
- [ ] **Vercel env vars set** (`TDS_API_KEY`, `NEXT_PUBLIC_PRM_PROXY_BASE`, `NEXT_PUBLIC_PRM_ACCOUNT_ID`; remove `NEXT_PUBLIC_TDS_API_KEY`)
- [ ] **End-to-end form test on Vercel** — lead in PRM + email + referral upload
- [ ] **GTG validation** — four curl checks pass post-deploy
- [ ] **Google Maps API allowlist** — add Oldham domains
- [ ] DNS pointed to Vercel
