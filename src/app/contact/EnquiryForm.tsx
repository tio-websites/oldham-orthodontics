"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { submitPrmForm } from "@/app/lib/formSubmit";
import * as v from "@/app/lib/validators";

const PRM_ACCOUNT_ID = process.env.NEXT_PUBLIC_PRM_ACCOUNT_ID || "";
const PRM_WEB_FORM = "wf/nyw6lrrwpd/bdba9cd293355d512336";
const THANKS_URL = "/contact-thank-you";
const EMAIL_LOCAL_PART = "info";
const EMAIL_DOMAIN = "oldhamorthodontics.co.uk";

const subjects = [
  "General enquiry",
  "Question about treatment",
  "Question about an appointment",
  "Costs and finance",
  "Something else",
];

type ErrorMap = Record<string, string | null>;

export default function EnquiryForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorMap>({});
  const [subject, setSubject] = useState("");

  function validate(form: HTMLFormElement): ErrorMap {
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "";
    return {
      firstname: v.required(get("firstname"), "First name"),
      lastname: v.required(get("lastname"), "Last name"),
      email: v.email(get("email")),
      phone: v.phone(get("phone")),
      subject: v.required(get("subject"), "Subject"),
      message: v.required(get("message"), "Message"),
    };
  }

  function handleFieldBlur(e: React.FocusEvent<HTMLFormElement>) {
    const target = e.target as unknown as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
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
      case "subject":
        err = v.required(value, "Subject");
        break;
      case "message":
        err = v.required(value, "Message");
        break;
      default:
        return;
    }
    setErrors((prev) => ({ ...prev, [target.name]: err }));
  }

  const emailSubject = subject
    ? `Oldham Orthodontics — ${subject}`
    : "Oldham Orthodontics — Contact Enquiry";

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
    <section className="consult-banner-section">
      <div className="consult-banner-container">
        <div className="consult-banner-image">
          <img
            src="/images/contact-enquiry.webp"
            alt="A woman smiling while reaching out from a sunlit outdoor cafe"
            width={1600}
            height={1067}
            loading="lazy"
          />
        </div>
        <div className="consult-banner-content">
          <span className="consult-banner-label">SEND US A MESSAGE</span>
          <h2>
            Get in touch <span>with the team</span>
          </h2>
          <p>
            Have a question about treatment, costs or your next visit? Drop us a line and we&apos;ll come back to you within one working day.
          </p>

          <form
            className="consult-banner-form enquiry-banner-form ajax_form"
            onSubmit={handleSubmit}
            onBlur={handleFieldBlur}
          >
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
              placeholder="E-mail"
              autoComplete="email"
              aria-invalid={errors.email ? true : undefined}
              maxLength={120}
              required
            />
            <input
              type="tel"
              name="phone"
              aria-label="Phone number"
              placeholder="Phone number"
              autoComplete="tel"
              aria-invalid={errors.phone ? true : undefined}
              inputMode="tel"
              pattern="[\d\s+()\-]{6,}"
              minLength={6}
              maxLength={20}
              required
            />
            <select
              name="subject"
              aria-label="What is your enquiry about?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              aria-invalid={errors.subject ? true : undefined}
              required
            >
              <option value="" disabled>
                What is your enquiry about?
              </option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <textarea
              name="message"
              aria-label="Your message"
              placeholder="Your message"
              rows={5}
              aria-invalid={errors.message ? true : undefined}
              minLength={5}
              maxLength={2000}
              required
            />

            {/* Honeypots — off-screen, generic names so password managers don't trip them. */}
            <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <input type="text" name="oo_hp_a" tabIndex={-1} autoComplete="off" defaultValue="" />
              <input type="text" name="oo_hp_b" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>

            {/* PRM routing */}
            <input type="hidden" name="accountid" defaultValue={PRM_ACCOUNT_ID} />
            <input type="hidden" name="wf" defaultValue={PRM_WEB_FORM} />
            <input type="hidden" name="prm-note" value="prm-note" />
            <input type="hidden" name="thanks" defaultValue={THANKS_URL} />
            <input type="hidden" name="page_name" value="contact" />
            <input type="hidden" name="gdpr" value="gdpr" />
            <input type="hidden" name="email_subject" value={emailSubject} />
            <input type="hidden" name="gdpr_email_subject" value={`${emailSubject} (GDPR)`} />
            <input type="hidden" name="local_part[0]" value={EMAIL_LOCAL_PART} />
            <input type="hidden" name="domain[0]" value={EMAIL_DOMAIN} />

            {/* UTM attribution — populated at runtime by tracking script if present */}
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
              {submitting ? "Sending…" : "Send Message"}
            </button>
            <p className="enquiry-banner-privacy">
              We&apos;ll only use your details to respond to this enquiry. For further information please read our <a href="/privacy-policy">privacy policy</a>.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
