"use client";

import { useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { submitPrmForm, uploadFile } from "@/app/lib/formSubmit";
import * as v from "@/app/lib/validators";

const PRM_ACCOUNT_ID = process.env.NEXT_PUBLIC_PRM_ACCOUNT_ID || "";
const PRM_WEB_FORM = "wf/r9zy3p206q/9ebc81c406a16a315785";
const THANKS_URL = "/referral-thank-you";
const EMAIL_LOCAL_PART = "info";
const EMAIL_DOMAIN = "oldhamorthodontics.co.uk";
const EMAIL_SUBJECT = "Oldham Orthodontics — Dentist Referral";

const MAX_PHOTOS = 8;

type ErrorMap = Record<string, string | null>;

interface UploadedFile {
  url: string;
  name: string;
}

export default function ReferralForm() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorMap>({});
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function validate(form: HTMLFormElement): ErrorMap {
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "";
    return {
      dentist_name: v.required(get("dentist_name"), "Dentist name"),
      dentist_email: v.email(get("dentist_email")),
      dentist_phone: v.phone(get("dentist_phone")),
      firstname: v.required(get("firstname"), "Patient first name"),
      lastname: v.required(get("lastname"), "Patient last name"),
      patient_dob: v.required(get("patient_dob"), "Date of birth"),
      email: v.email(get("email")),
      phone: v.phone(get("phone")),
      reason_for_referral: v.required(get("reason_for_referral"), "Reason for referral"),
    };
  }

  function handleFieldBlur(e: React.FocusEvent<HTMLFormElement>) {
    const target = e.target as unknown as HTMLInputElement | HTMLTextAreaElement;
    if (!target.name) return;
    const value = target.value;
    let err: string | null = null;
    switch (target.name) {
      case "dentist_name":
        err = v.required(value, "Dentist name");
        break;
      case "dentist_email":
        err = v.email(value);
        break;
      case "dentist_phone":
        err = v.phone(value);
        break;
      case "firstname":
        err = v.required(value, "Patient first name");
        break;
      case "lastname":
        err = v.required(value, "Patient last name");
        break;
      case "patient_dob":
        err = v.required(value, "Date of birth");
        break;
      case "email":
        err = v.email(value);
        break;
      case "phone":
        err = v.phone(value);
        break;
      case "reason_for_referral":
        err = v.required(value, "Reason for referral");
        break;
      default:
        return;
    }
    setErrors((prev) => ({ ...prev, [target.name]: err }));
  }

  async function handleFileSelection(e: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!selected.length) return;
    const remaining = MAX_PHOTOS - files.length;
    if (remaining <= 0) {
      setUploadError(`Maximum ${MAX_PHOTOS} images allowed.`);
      return;
    }
    const toUpload = selected.slice(0, remaining);
    if (selected.length > remaining) {
      setUploadError(
        `Only ${remaining} more image${remaining === 1 ? "" : "s"} allowed.`,
      );
    } else {
      setUploadError(null);
    }

    for (const file of toUpload) {
      setUploading((n) => n + 1);
      const result = await uploadFile(file);
      setUploading((n) => n - 1);
      if (result.success && result.url) {
        setFiles((prev) => [
          ...prev,
          { url: result.url!, name: result.name ?? file.name },
        ]);
      } else {
        setUploadError(result.error ?? `Failed to upload ${file.name}`);
      }
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (uploading > 0) {
      setError("Please wait for image uploads to finish before submitting.");
      return;
    }
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
    <form className="referral-form ajax_form" onSubmit={handleSubmit} onBlur={handleFieldBlur}>
      <div className="referral-fieldset">
        <h3>Dentist&apos;s details</h3>
        <div className="referral-grid">
          <input
            type="text"
            name="dentist_name"
            aria-label="Dentist name"
            placeholder="Dentist name *"
            autoComplete="name"
            aria-invalid={errors.dentist_name ? true : undefined}
            minLength={2}
            maxLength={120}
            required
          />
          <input
            type="text"
            name="practice_name"
            aria-label="Practice name"
            placeholder="Practice name"
            maxLength={120}
          />
          <input
            type="text"
            name="practice_address"
            aria-label="Practice address"
            className="referral-grid--full"
            placeholder="Practice address"
            autoComplete="street-address"
            maxLength={200}
          />
          <input
            type="email"
            name="dentist_email"
            aria-label="Dentist email"
            placeholder="Email *"
            autoComplete="email"
            aria-invalid={errors.dentist_email ? true : undefined}
            maxLength={120}
            required
          />
          <input
            type="tel"
            name="dentist_phone"
            aria-label="Dentist phone"
            placeholder="Phone *"
            autoComplete="tel"
            aria-invalid={errors.dentist_phone ? true : undefined}
            inputMode="tel"
            pattern="[\d\s+()\-]{6,}"
            minLength={6}
            maxLength={20}
            required
          />
        </div>
      </div>

      <div className="referral-fieldset">
        <h3>Patient&apos;s details</h3>
        <div className="referral-grid">
          <input
            type="text"
            name="firstname"
            aria-label="Patient first name"
            placeholder="First name *"
            autoComplete="given-name"
            aria-invalid={errors.firstname ? true : undefined}
            minLength={2}
            maxLength={60}
            required
          />
          <input
            type="text"
            name="lastname"
            aria-label="Patient last name"
            placeholder="Last name *"
            autoComplete="family-name"
            aria-invalid={errors.lastname ? true : undefined}
            minLength={2}
            maxLength={60}
            required
          />
          <input
            type="text"
            name="patient_dob"
            aria-label="Patient date of birth"
            placeholder="Date of birth *"
            aria-invalid={errors.patient_dob ? true : undefined}
            maxLength={20}
            required
          />
          <input
            type="text"
            name="patient_guardian"
            aria-label="Parent or guardian's name"
            placeholder="Parent or guardian's name (if applicable)"
            maxLength={120}
          />
          <input
            type="text"
            name="patient_address"
            aria-label="Patient address"
            className="referral-grid--full"
            placeholder="Address"
            autoComplete="street-address"
            maxLength={200}
          />
          <input
            type="email"
            name="email"
            aria-label="Patient email"
            placeholder="Email *"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            maxLength={120}
            required
          />
          <input
            type="tel"
            name="phone"
            aria-label="Patient phone"
            placeholder="Phone *"
            autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            inputMode="tel"
            pattern="[\d\s+()\-]{6,}"
            minLength={6}
            maxLength={20}
            required
          />
        </div>
      </div>

      <div className="referral-fieldset">
        <h3>Reason for referral</h3>
        <textarea
          name="reason_for_referral"
          aria-label="Reason for referral"
          placeholder="Brief clinical notes, presenting concerns, anything we should know before the patient&apos;s first visit."
          rows={5}
          aria-invalid={errors.reason_for_referral ? true : undefined}
          minLength={5}
          maxLength={4000}
          required
        />
      </div>

      <div className="referral-fieldset">
        <h3>Send us patient photos</h3>
        <p className="referral-photos-help">
          Optional. Up to {MAX_PHOTOS} clinical photographs (front, side, occlusal etc). Helps us review the case before the consultation.
        </p>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileSelection}
        />
        <button
          type="button"
          className="btn btn-outline referral-photos-btn"
          onClick={() => fileInput.current?.click()}
          disabled={files.length >= MAX_PHOTOS || uploading > 0}
        >
          {uploading > 0
            ? `Uploading ${uploading}…`
            : files.length === 0
              ? "Choose photos"
              : `Add more (${files.length}/${MAX_PHOTOS})`}
        </button>
        {files.length > 0 && (
          <ul className="referral-photos-list">
            {files.map((f, i) => (
              <li key={`${f.url}-${i}`}>
                <span>{f.name}</span>
                <button type="button" onClick={() => removeFile(i)} aria-label={`Remove ${f.name}`}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        {uploadError && (
          <p role="alert" className="form-error form-error--warn">
            {uploadError}
          </p>
        )}

        {/* Uploaded image URLs submitted as referral_photo_1..N */}
        {files.map((f, i) => (
          <input
            key={`referral_photo-${i}`}
            type="hidden"
            name={`referral_photo_${i + 1}`}
            value={f.url}
          />
        ))}
      </div>

      <p className="enquiry-banner-privacy">
        Patient information shared here is handled in line with our <a href="/privacy-policy">privacy policy</a>.
      </p>

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
      <input type="hidden" name="page_name" value="dentist-referrals" />
      <input type="hidden" name="gdpr" value="gdpr" />
      {/* PRM-side dentist-form flag — required for this wf's GDPR email template to dispatch */}
      <input type="hidden" name="dentist_form" value="1" />
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

      <button type="submit" className="btn btn-accent referral-submit" disabled={submitting || uploading > 0}>
        {submitting ? "Sending…" : uploading > 0 ? "Uploading images…" : "Send referral"}
      </button>
    </form>
  );
}
