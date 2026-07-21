"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { submitPrmForm } from "@/app/lib/formSubmit";
import * as v from "@/app/lib/validators";

type ConsultBannerFormProps = {
  label?: string;
  title: React.ReactNode;
  description: string;
  image: string;
  imageAlt?: string;
  /** Optional override for analytics / PRM `page_name`. */
  pageName?: string;
};

const PRM_ACCOUNT_ID = process.env.NEXT_PUBLIC_PRM_ACCOUNT_ID || "";
const PRM_WEB_FORM = "wf/9vwmnqe0xr/bc4c109e526c29e859de";
const THANKS_URL = "/consultation-thank-you";
const EMAIL_LOCAL_PART = "info";
const EMAIL_DOMAIN = "oldhamorthodontics.co.uk";
const EMAIL_SUBJECT = "Oldham Orthodontics — Free Consultation Request";

type ErrorMap = Record<string, string | null>;

export default function ConsultBannerForm({
  label = "BOOK FREE CONSULTATION",
  title,
  description,
  image,
  imageAlt = "",
  pageName = "inner-page-banner",
}: ConsultBannerFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorMap>({});

  function validate(form: HTMLFormElement): ErrorMap {
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "";
    return {
      firstname: v.required(get("firstname"), "First name"),
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
    <section id="consultation" className="consult-banner-section">
      <div className="consult-banner-container">
        <div className="consult-banner-image">
          <img src={image} alt={imageAlt} width={1600} height={900} loading="lazy" />
        </div>
        <div className="consult-banner-content">
          <span className="consult-banner-label">{label}</span>
          <h2>{title}</h2>
          <p>{description}</p>
          <form className="consult-banner-form ajax_form" onSubmit={handleSubmit} onBlur={handleFieldBlur}>
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
            <input type="hidden" name="page_name" value={pageName} />
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

            <button type="submit" className="btn btn-accent" disabled={submitting}>
              {submitting ? "Sending…" : "FREE CONSULTATION"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
