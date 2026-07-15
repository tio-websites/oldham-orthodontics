"use client";

import { useMemo, useState } from "react";

// Buyline finance calculator for Oldham Orthodontics.
// Two products (figures supplied by the practice / Buyline):
//   • Interest-Free Credit — 0% APR         (monthly = amount financed / term)
//   • Pay Monthly          — 13.9% APR rep. (standard amortisation)
// Representative examples (for the FCA representative APR) are shown beneath the tool.
//
// Term ranges / min deposit below are sensible defaults — CONFIRM the exact
// available terms + minimum deposit per product with Buyline.

const PAY_MONTHLY_APR = 0.139;

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
