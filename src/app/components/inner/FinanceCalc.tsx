"use client";

import { useMemo, useState, type FormEvent } from "react";
import { submitPrmForm } from "@/app/lib/formSubmit";

// Buyline finance calculator for Oldham Orthodontics.
// Two products (figures supplied by the practice / Buyline):
//   • Interest-Free Credit — 0% APR         (monthly = amount financed / term)
//   • Pay Monthly          — 13.9% APR rep. (standard amortisation)
// Representative examples (for the FCA representative APR) are shown beneath the tool.
//
// Term ranges / min deposit below are sensible defaults — CONFIRM the exact
// available terms + minimum deposit per product with Buyline.

const PAY_MONTHLY_APR = 0.139;

// PRM routing — mirrors the working contact form so calculator leads land in
// the same PRM inbox, tagged as a finance-calculator enquiry.
const PRM_ACCOUNT_ID = process.env.NEXT_PUBLIC_PRM_ACCOUNT_ID || "";
const PRM_WEB_FORM = "wf/nyw6lrrwpd/bdba9cd293355d512336";
const EMAIL_LOCAL_PART = "info";
const EMAIL_DOMAIN = "oldhamorthodontics.co.uk";

type Plan = "interest-free" | "pay-monthly";

const PLANS: Record<
  Plan,
  { label: string; apr: number; aprLabel: string; minMonths: number; maxMonths: number; defMonths: number }
> = {
  "interest-free": { label: "Interest-free (0% APR)", apr: 0, aprLabel: "0%", minMonths: 6, maxMonths: 24, defMonths: 18 },
  "pay-monthly": { label: "Pay monthly (13.9% APR)", apr: PAY_MONTHLY_APR, aprLabel: "13.9%", minMonths: 24, maxMonths: 60, defMonths: 48 },
};

const COST_MIN = 1000;
const COST_MAX = 8000;

function money(n: number) {
  return n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function FinanceCalc() {
  const [plan, setPlan] = useState<Plan>("interest-free");
  const [cost, setCost] = useState(3000);
  const [deposit, setDeposit] = useState(300);
  const [months, setMonths] = useState(PLANS["interest-free"].defMonths);

  const cfg = PLANS[plan];
  const safeDeposit = Math.min(deposit, cost);
  const financed = Math.max(0, cost - safeDeposit);

  function choosePlan(p: Plan) {
    setPlan(p);
    // clamp the term into the new plan's range
    setMonths((m) => Math.min(PLANS[p].maxMonths, Math.max(PLANS[p].minMonths, m)));
  }

  const { monthly, totalCharge, totalRepayable } = useMemo(() => {
    if (months <= 0) return { monthly: 0, totalCharge: 0, totalRepayable: cost };
    if (cfg.apr === 0) {
      const m = financed / months;
      return { monthly: m, totalCharge: 0, totalRepayable: financed + safeDeposit };
    }
    const r = Math.pow(1 + cfg.apr, 1 / 12) - 1;
    const m = (financed * r) / (1 - Math.pow(1 + r, -months));
    const paidOverTerm = m * months;
    return {
      monthly: m,
      totalCharge: paidOverTerm - financed,
      totalRepayable: paidOverTerm + safeDeposit,
    };
  }, [cfg.apr, financed, months, safeDeposit, cost]);

  return (
    <section className="finance-calc-section">
      <div className="finance-calc">
        <div className="fc-header">
          <span className="fc-label">FINANCE CALCULATOR</span>
          <h2>Estimate your monthly payments</h2>
          <p>
            Move the sliders to see an indicative payment plan through our finance partner Buyline. These figures are a
            guide only - your exact terms are confirmed with Buyline, subject to status and affordability.
          </p>
        </div>

        <div className="fc-grid">
          <div className="fc-controls">
            <div className="fc-plan-toggle" role="tablist" aria-label="Finance plan">
              {(Object.keys(PLANS) as Plan[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  role="tab"
                  aria-selected={plan === p}
                  className={`fc-plan-btn ${plan === p ? "active" : ""}`}
                  onClick={() => choosePlan(p)}
                >
                  {PLANS[p].label}
                </button>
              ))}
            </div>

            <Slider
              label="Cost of treatment"
              value={cost}
              min={COST_MIN}
              max={COST_MAX}
              step={50}
              onChange={(v) => {
                setCost(v);
                if (deposit > v) setDeposit(v);
              }}
            />
            <Slider
              label="Deposit"
              value={safeDeposit}
              min={0}
              max={cost}
              step={10}
              onChange={setDeposit}
            />
            <Slider
              label="Repayment term"
              value={months}
              min={cfg.minMonths}
              max={cfg.maxMonths}
              step={1}
              suffix=" months"
              money={false}
              onChange={setMonths}
            />
          </div>

          <div className="fc-results">
            <div className="fc-result-headline">
              <span className="fc-result-amount">&pound;{money(monthly)}</span>
              <span className="fc-result-per">per month</span>
            </div>
            <dl className="fc-breakdown">
              <div><dt>Deposit</dt><dd>&pound;{money(safeDeposit)}</dd></div>
              <div><dt>Amount of credit</dt><dd>&pound;{money(financed)}</dd></div>
              <div><dt>Term</dt><dd>{months} months</dd></div>
              <div><dt>Total charge for credit</dt><dd>&pound;{money(totalCharge)}</dd></div>
              <div><dt>Total repayable</dt><dd>&pound;{money(totalRepayable)}</dd></div>
              <div><dt>Representative APR</dt><dd>{cfg.aprLabel} (fixed)</dd></div>
            </dl>
            <QuoteForm
              summary={`Finance calculator enquiry — ${cfg.label}. Treatment £${money(cost)}, deposit £${money(safeDeposit)}, ${months} months, est. £${money(monthly)}/month, total repayable £${money(totalRepayable)}, ${cfg.aprLabel} APR.`}
            />
          </div>
        </div>

        <p className="fc-disclaimer">
          Representative examples: <strong>Interest-Free Credit</strong> - purchase &pound;1,200, deposit &pound;150,
          amount of credit &pound;1,050 over 18 months, 18 monthly payments of &pound;58.33, total charge for credit
          &pound;0, total repayable &pound;1,050, 0% APR (fixed). <strong>Pay Monthly</strong> - purchase &pound;7,600,
          deposit &pound;260, amount of credit &pound;7,340 over 48 months, 48 monthly payments of &pound;197.21, total
          charge for credit &pound;2,126.08, total repayable &pound;9,726.08, 13.9% APR representative (fixed). Finance is
          provided by Buyline and is subject to status and affordability. Figures shown by the calculator are indicative
          only.
        </p>
      </div>
    </section>
  );
}

function QuoteForm({ summary }: { summary: string }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    const result = await submitPrmForm(e.currentTarget);
    if (result.success) {
      setSent(true);
      return;
    }
    setError(result.error ?? "Something went wrong. Please try again.");
    setSubmitting(false);
  }

  if (sent) {
    return (
      <div className="fc-quote-thanks">
        <h3>Thanks - your estimate is on its way to the team.</h3>
        <p>We&apos;ll be in touch to talk through your options. Exact terms are confirmed with Buyline.</p>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" className="btn btn-accent fc-quote-open" onClick={() => setOpen(true)}>
        Request this estimate
      </button>
    );
  }

  return (
    <form className="fc-quote-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="firstname"
        placeholder="Your name"
        aria-label="Your name"
        autoComplete="name"
        minLength={2}
        maxLength={80}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        aria-label="Email"
        autoComplete="email"
        maxLength={120}
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone"
        aria-label="Phone"
        autoComplete="tel"
        pattern="[\d\s+()\-]{6,}"
        minLength={6}
        maxLength={20}
        required
      />

      {/* carries the calculated estimate into the enquiry */}
      <textarea name="message" defaultValue={summary} readOnly hidden />

      {/* Honeypots (match formSubmit.ts) */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, width: 0, overflow: "hidden" }}>
        <input type="text" name="oo_hp_a" tabIndex={-1} autoComplete="off" defaultValue="" />
        <input type="text" name="oo_hp_b" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {/* PRM routing — mirrors the contact form */}
      <input type="hidden" name="lastname" defaultValue="." />
      <input type="hidden" name="accountid" defaultValue={PRM_ACCOUNT_ID} />
      <input type="hidden" name="wf" defaultValue={PRM_WEB_FORM} />
      <input type="hidden" name="prm-note" value="prm-note" />
      <input type="hidden" name="page_name" value="costs-calculator" />
      <input type="hidden" name="gdpr" value="gdpr" />
      <input type="hidden" name="email_subject" value="Oldham Orthodontics — Finance calculator enquiry" />
      <input type="hidden" name="gdpr_email_subject" value="Oldham Orthodontics — Finance calculator enquiry (GDPR)" />
      <input type="hidden" name="local_part[0]" value={EMAIL_LOCAL_PART} />
      <input type="hidden" name="domain[0]" value={EMAIL_DOMAIN} />

      <p className="fc-quote-privacy">
        We&apos;ll only use your details to respond to this enquiry. See our <a href="/privacy-policy">privacy policy</a>.
      </p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="btn btn-accent" disabled={submitting}>
        {submitting ? "Sending…" : "Send my estimate"}
      </button>
    </form>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  money: isMoney = true,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  money?: boolean;
  suffix?: string;
}) {
  return (
    <div className="fc-slider">
      <div className="fc-slider-head">
        <label>{label}</label>
        <span className="fc-slider-value">
          {isMoney ? `£${value.toLocaleString("en-GB")}` : `${value}${suffix}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  );
}
