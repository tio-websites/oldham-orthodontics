"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import "../inner-page.css";
import "./booking.css";
import { submitPrmForm } from "@/app/lib/formSubmit";
import * as v from "@/app/lib/validators";

const PRM_ACCOUNT_ID = process.env.NEXT_PUBLIC_PRM_ACCOUNT_ID || "";
const PRM_WEB_FORM = "wf/9vwmnqe0xr/bc4c109e526c29e859de";
const THANKS_URL = "/consultation-thank-you";
const EMAIL_LOCAL_PART = "info";
const EMAIL_DOMAIN = "oldhamorthodontics.co.uk";
const EMAIL_SUBJECT = "Oldham Orthodontics — Free Consultation Request";

type ErrorMap = Record<string, string | null>;

const steps = [
  {
    title: "Warm Welcome",
    description: "Meet our friendly team and enjoy a relaxed environment from the moment you arrive.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 56v-4a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v4" />
        <circle cx="32" cy="24" r="10" />
        <path d="M48 16l4-4M16 16l-4-4" />
      </svg>
    ),
  },
  {
    title: "A Closer Look",
    description: "A Specialist Orthodontist will examine your smile and discuss your goals in detail.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="26" cy="26" r="14" />
        <line x1="36.5" y1="36.5" x2="52" y2="52" />
      </svg>
    ),
  },
  {
    title: "Tailored Plan",
    description: "We'll talk through the right treatment options for you and explain timings and costs clearly.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="14" y="12" width="36" height="44" rx="2" />
        <line x1="22" y1="22" x2="42" y2="22" />
        <line x1="22" y1="32" x2="42" y2="32" />
        <line x1="22" y1="42" x2="34" y2="42" />
      </svg>
    ),
  },
  {
    title: "Next Steps",
    description: "If you're happy to go ahead, we'll book your treatment start date - no pressure, no obligation.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="12" y="14" width="40" height="42" rx="3" />
        <line x1="12" y1="26" x2="52" y2="26" />
        <line x1="22" y1="10" x2="22" y2="20" />
        <line x1="42" y1="10" x2="42" y2="20" />
        <polyline points="22 41 30 49 42 35" />
      </svg>
    ),
  },
];

export default function FreeConsultationPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorMap>({});

  function validate(form: HTMLFormElement): ErrorMap {
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "";
    return {
      firstname: v.required(get("firstname"), "First name"),
      lastname: v.required(get("lastname"), "Last name"),
      email: v.email(get("email")),
      phone: v.phone(get("phone")),
    };
  }

  function handleFieldBlur(e: React.FocusEvent<HTMLFormElement>) {
    const target = e.target as unknown as HTMLInputElement;
    if (!target.name) return;
    const value = target.value;
    let err: string | null = null;
    switch (target.name) {
      case "firstname":
        err = v.required(value, "First name");
        break;
      case "lastname":
        err = v.required(value, "Last name");
        break;
      case "email":
        err = v.email(value);
        break;
      case "phone":
        err = v.phone(value);
        break;
      default:
        return;
    }
    setErrors((prev) => ({ ...prev, [target.name]: err }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const result = validate(form);
    setErrors(result);
    if (Object.values(result).some(Boolean)) {
      setError("Please fix the highlighted fields and try again.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const submitResult = await submitPrmForm(form);
    if (submitResult.success) {
      router.push(THANKS_URL);
      return;
    }

    setError(submitResult.error ?? "Something went wrong. Please try again.");
    setSubmitting(false);
  }

  return (
    <>
      <section id="booking" className="booking-hero">
        <div className="booking-hero-container">
          <div className="booking-hero-content">
            <span className="booking-hero-label">BOOK FREE CONSULTATION</span>
            <h1>
              Start your smile journey with a free,
              <br />
              no-obligation consultation
            </h1>
            <p>
              Meet our Specialist Orthodontists, talk through your goals, and discover the
              right treatment for you. There&apos;s no pressure - just expert advice and a clear plan.
            </p>
            <form className="booking-form ajax_form" onSubmit={handleSubmit} onBlur={handleFieldBlur}>
              <input
                type="text"
                name="firstname"
                aria-label="First Name"
                placeholder="First Name"
                autoComplete="given-name"
                aria-invalid={errors.firstname ? true : undefined}
                minLength={2}
                maxLength={60}
                required
              />
              <input
                type="text"
                name="lastname"
                aria-label="Last Name"
                placeholder="Last Name"
                autoComplete="family-name"
                aria-invalid={errors.lastname ? true : undefined}
                minLength={2}
                maxLength={60}
                required
              />
              <input
                type="email"
                name="email"
                aria-label="Email"
                placeholder="Email"
                autoComplete="email"
                aria-invalid={errors.email ? true : undefined}
                maxLength={120}
                required
              />
              <input
                type="tel"
                name="phone"
                aria-label="Phone Number"
                placeholder="Phone Number"
                autoComplete="tel"
                aria-invalid={errors.phone ? true : undefined}
                inputMode="tel"
                pattern="[\d\s+()\-]{6,}"
                minLength={6}
                maxLength={20}
                required
              />

              {/* Honeypots */}
              <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <input type="text" name="oo_hp_a" tabIndex={-1} autoComplete="off" defaultValue="" />
                <input type="text" name="oo_hp_b" tabIndex={-1} autoComplete="off" defaultValue="" />
              </div>

              {/* PRM routing */}
              <input type="hidden" name="accountid" defaultValue={PRM_ACCOUNT_ID} />
              <input type="hidden" name="wf" defaultValue={PRM_WEB_FORM} />
              <input type="hidden" name="prm-note" value="prm-note" />
              <input type="hidden" name="thanks" defaultValue={THANKS_URL} />
              <input type="hidden" name="page_name" value="free-consultation" />
              <input type="hidden" name="gdpr" value="gdpr" />
              <input type="hidden" name="email_subject" value={EMAIL_SUBJECT} />
              <input type="hidden" name="gdpr_email_subject" value={`${EMAIL_SUBJECT} (GDPR)`} />
              <input type="hidden" name="local_part[0]" value={EMAIL_LOCAL_PART} />
              <input type="hidden" name="domain[0]" value={EMAIL_DOMAIN} />

              {/* UTM attribution */}
              <input type="hidden" name="custom14" defaultValue="" id="fPages" />
              <input type="hidden" name="custom15" defaultValue="" id="fContent" />
              <input type="hidden" name="custom16" defaultValue="" id="fSource" />
              <input type="hidden" name="custom17" defaultValue="" id="fMedium" />
              <input type="hidden" name="custom18" defaultValue="" id="fTerm" />
              <input type="hidden" name="custom19" defaultValue="" id="fCampaign" />
              <input type="hidden" name="custom20" defaultValue="" id="fClientId" />

              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}

              <button type="submit" className="btn btn-accent booking-submit" disabled={submitting}>
                {submitting ? "Sending…" : "Book your free consultation"}
              </button>
              <p className="booking-privacy">
                For further information please read our{" "}
                <a href="/privacy-policy">privacy policy</a>.
              </p>
            </form>
          </div>
          <div className="booking-hero-image">
            <img src="/images/free-consultation-hero.webp" alt="A patient smiling during a relaxed consultation with her orthodontist" width={1200} height={800} loading="lazy" />
          </div>
        </div>
      </section>

      <section className="appointment-steps">
        <div className="appointment-steps-container">
          <h2>What happens at your appointment?</h2>
          <p className="appointment-steps-intro">
            Your free consultation takes around 30 minutes. Here&apos;s exactly what to expect when
            you visit us - friendly faces, expert advice, and a clear next step.
          </p>
          <div className="appointment-steps-grid">
            {steps.map((step, i) => (
              <div key={i} className="appointment-step">
                <div className="appointment-step-icon">{step.icon}</div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
          <a href="#booking" className="btn btn-accent appointment-steps-cta">
            Arrange your free consultation
          </a>
        </div>
      </section>
    </>
  );
}
