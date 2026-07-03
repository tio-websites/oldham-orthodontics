import type { Metadata } from "next";
import Link from "next/link";
import "../inner-page.css";

import InnerHero from "../components/inner/InnerHero";
import ContentSection from "../components/inner/ContentSection";
import BenefitsGrid from "../components/inner/BenefitsGrid";
import CTABanner from "../components/inner/CTABanner";
import SectionDivider from "../components/SectionDivider";
import { links } from "../lib/internal-links";

export const metadata: Metadata = {
  title: "Costs & Finance | Transparent Pricing",
  description: "Explore treatment costs at Oldham Orthodontics. Clear, all-inclusive pricing with 0% interest finance and monthly payment plans. Book your free consultation today.",
};

const NAVY = "#1a1a3e";
const WHITE = "#fff";
const WARM = "#faf7f4";

const included = [
  { title: "Your full treatment plan", description: "Every adjustment, refit and progress check needed to deliver your final smile - all costed into your quote upfront." },
  { title: "Digital 3D scans", description: "Modern intra-oral scans replace messy impressions, and let us show you a preview of your projected result before you commit." },
  { title: "Specialist Orthodontist care", description: "Every plan is led by a Specialist Orthodontist with years of experience, not handed off to a general dentist." },
  { title: "Your first retainer", description: "A retainer to protect your new smile is built into the cost of every treatment plan - no surprise add-on at the end." },
  { title: "Aftercare reviews", description: "Follow-up visits after treatment finishes, so we can make sure your new smile is settling exactly as planned." },
  { title: "Honest, upfront pricing", description: "A clear total at the start, with no hidden extras. If something changes mid-treatment, we discuss it with you first." },
];

export default function CostsPage() {
  return (
    <>
      <InnerHero
        label="COSTS & FINANCE"
        title={
          <>
            Clear, all-inclusive
            <br />
            <span>treatment pricing</span>
          </>
        }
        description="Every smile is different, so every quote is different. What stays the same is our promise to be straightforward about cost from the very start - with a fixed total, included aftercare, and finance options designed to make treatment manageable."
        ctaText="Arrange your free consultation"
        image="/images/costs-hero.webp"
        imageAlt="A patient discussing her treatment plan with her orthodontist"
      />

      <SectionDivider from={WARM} to={WHITE} />

      <ContentSection
        label="OUR APPROACH"
        title="Transparent pricing, no surprises"
        paragraphs={[
          <>Because every case is different, we don&apos;t publish blanket price lists. The cost of your treatment depends on the type of treatment, how complex the case is, and the length of care you&apos;ll need. The only way to know your exact cost is to come in for a <Link href={links.freeConsultation}>free consultation</Link> - we&apos;ll take a proper look, talk through the options, and give you a personalised written quote.</>,
          "What we can promise is that the quote you receive is the cost. We include every appointment, scan, adjustment and review in the price upfront, plus your first retainer at the end. If anything changes mid-treatment, we'll always discuss it with you before any decision is made.",
        ]}
        image="/images/costs-included.webp"
        imageAlt="An orthodontist talking through a treatment plan with a patient"
      />

      <SectionDivider from={WARM} to={WHITE} />

      <BenefitsGrid
        title={
          <>
            What&apos;s included in <span>every treatment plan</span>
          </>
        }
        description="Our quotes are deliberately all-inclusive, so you can compare them like-for-like and know exactly what your money covers."
        benefits={included}
      />

      <SectionDivider from={WHITE} to={WARM} />

      <section className="price-guide">
        <div className="price-guide-inner">
          <span className="price-guide-label">GUIDE PRICES</span>
          <h2>Treatment costs at a glance</h2>
          <p className="price-guide-intro">
            To help you plan, here are our guide prices. Because every case is different, the figures below are starting points - your exact cost is confirmed in a personalised written quote at your <Link href={links.freeConsultation}>free consultation</Link>. Most treatments can be spread over 0% interest finance (see below).
          </p>

          <table className="price-table">
            <caption>TREATMENTS</caption>
            <tbody>
              <tr><td>Single arch &ndash; metal braces</td><td className="price-amount">from &pound;2,750</td></tr>
              <tr><td>Single arch &ndash; Clarity&trade; ceramic braces</td><td className="price-amount">from &pound;2,970</td></tr>
              <tr><td>Both arches &ndash; metal braces</td><td className="price-amount">from &pound;3,872</td></tr>
              <tr><td>Both arches &ndash; Clarity&trade; ceramic braces</td><td className="price-amount">from &pound;4,356</td></tr>
              <tr><td>Invisalign&reg; clear aligners</td><td className="price-amount">from &pound;4,950</td></tr>
              <tr><td>Lingual (hidden) braces</td><td className="price-amount">from &pound;6,100</td></tr>
              <tr><td>Lingual Lite</td><td className="price-amount">from &pound;4,500</td></tr>
              <tr><td>Removable appliances</td><td className="price-amount">from &pound;950</td></tr>
            </tbody>
          </table>

          <table className="price-table" style={{ marginTop: "28px" }}>
            <caption>RETAINERS, WHITENING &amp; EXTRAS</caption>
            <tbody>
              <tr><td>Teeth whitening</td><td className="price-amount">&pound;325</td></tr>
              <tr><td>Bonded (fixed) retainer</td><td className="price-amount">from &pound;195</td></tr>
              <tr><td>Essix (removable) retainer</td><td className="price-amount">&pound;140</td></tr>
              <tr><td>Replacement appliance (NHS)</td><td className="price-amount">&pound;99.63</td></tr>
            </tbody>
          </table>

          <p className="price-guide-note">
            Guide prices correct as of April 2026 and subject to change. Final costs are confirmed in your written treatment plan following consultation.
          </p>
        </div>
      </section>

      <ContentSection
        alt
        imagePosition="right"
        label="FINANCE OPTIONS"
        title="Spread the cost with 0% finance"
        paragraphs={[
          "We know orthodontic treatment is a significant decision, financially as well as personally. Our 0% interest finance plans let you spread the total cost across the length of your treatment, with no extra charge added on top.",
          "Most patients pay an initial deposit of £750 and then fixed monthly payments of £300 until the balance is cleared, with longer plans available for more complex cases. We'll always work out an arrangement that fits your budget.",
          "Bringing more than one family member in for treatment? We offer family and sibling discounts on combined treatment plans - just mention it at consultation and we'll factor it in.",
        ]}
        image="/images/costs-finance.webp"
        imageAlt="A couple reviewing finance paperwork together at home"
      />

      <SectionDivider from={WHITE} to={NAVY} variant="into-cta" />

      <CTABanner
        title="Want a personalised quote?"
        description="Book a free, no-obligation consultation with our Specialist Orthodontists. We'll discuss your goals, recommend the right treatment, and put together a clear written cost the same day."
        ctaText="Arrange your free consultation"
      />

      <SectionDivider from={NAVY} to={WARM} variant="out-of-cta" />
    </>
  );
}
