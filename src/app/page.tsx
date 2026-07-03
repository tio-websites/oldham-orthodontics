"use client";

import { useEffect, useRef, useState } from "react";
import BeforeAfterSlider from "./components/BeforeAfterSlider";

// Decorative floating logo for backgrounds
const FloatingLogo = ({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div className={`floating-logo ${className}`} style={style}>
    <img src="/images/oldham-circle-watermark.png" alt="" width={1664} height={1664} loading="lazy" />
  </div>
);

// Animated element component
function AnimatedElement({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${isVisible ? "visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

// Team data
const teamMembers = [
  { name: "Dr Ovais Malik", role: "CONSULTANT & SPECIALIST ORTHODONTIST", gender: "male", image: "/images/team/ovais-malik.webp" },
  { name: "Dr Sarah Glossop", role: "CONSULTANT & SPECIALIST ORTHODONTIST", gender: "female", image: "/images/team/sarah-glossop.webp" },
  { name: "Hamza Anwar", role: "SPECIALIST ORTHODONTIST", gender: "male", image: "/images/team/hamza-anwar.webp" },
  { name: "Dr Nadia Stivaros", role: "SPECIALIST IN ORTHODONTICS", gender: "female", image: "/images/team/nadia-stivaros.webp" },
  { name: "Dr Samer Salam", role: "SPECIALIST IN ORTHODONTICS", gender: "male", image: "/images/team/samer-salam.webp" },
  { name: "Dr Simon Watkinson", role: "CONSULTANT & SPECIALIST ORTHODONTIST", gender: "male", image: "/images/team/simon-watkinson.webp" },
  { name: "Dr Richard Needham", role: "CONSULTANT & SPECIALIST ORTHODONTIST", gender: "male", image: "/images/team/richard-needham.webp" },
];

// Team Section with carousel
function TeamSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getCardPosition = (index: number) => {
    const diff = index - activeIndex;
    const totalMembers = teamMembers.length;

    // Handle wrap-around
    let normalizedDiff = diff;
    if (diff > totalMembers / 2) normalizedDiff = diff - totalMembers;
    if (diff < -totalMembers / 2) normalizedDiff = diff + totalMembers;

    if (normalizedDiff === 0) return "center";
    if (normalizedDiff === -1) return "left";
    if (normalizedDiff === 1) return "right";
    if (normalizedDiff === -2) return "far-left";
    if (normalizedDiff === 2) return "far-right";
    return "hidden";
  };

  return (
    <section className="team">
      <div className="team-container">
        <div className="team-content">
          <div className="section-label">Meet The Team</div>
          <h2 className="team-title">
            <span className="team-title-line1">Specialist Orthodontists</span>
            <span className="team-title-line2">Dedicated To Exceptional Care</span>
          </h2>
          <p className="team-description">
            With decades of combined experience, our Specialist Orthodontist team
            is here to help you achieve a straighter smile - whether you&apos;re
            considering aligners, braces, or other treatments. No matter your
            starting point or goals, you&apos;ll be in safe, trusted hands.
          </p>
          <a href="/about-us/meet-our-team" className="btn-team-cta">
            Meet Our Team
          </a>
        </div>
        <div className="team-carousel">
          <button className="carousel-btn carousel-btn-prev" onClick={handlePrev} disabled={isAnimating}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="carousel-cards">
            {teamMembers.map((member, index) => {
              const position = getCardPosition(index);
              if (position === "hidden") return null;
              return (
                <div
                  key={member.name}
                  className={`carousel-card carousel-card-${position}`}
                >
                  <div className={`carousel-card-img carousel-card-img-${member.gender}`}>
                    {member.image ? (
                      <img src={member.image} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} width={1600} height={900} loading="lazy" />
                    ) : (
                      <svg viewBox="0 0 100 100" className="placeholder-avatar">
                        <circle cx="50" cy="35" r="20" fill="currentColor" opacity="0.3" />
                        <ellipse cx="50" cy="85" rx="30" ry="25" fill="currentColor" opacity="0.3" />
                      </svg>
                    )}
                  </div>
                  <div className="carousel-card-info">
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="carousel-btn carousel-btn-next" onClick={handleNext} disabled={isAnimating}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <img src="/images/hero.jpg" alt="Orthodontics patient smiling" width={5988} height={3992} loading="lazy" />
        </div>
        <FloatingLogo
          className="xl drift light"
          style={{ top: "15%", left: "5%", opacity: 0.06 }}
        />
        <FloatingLogo
          className="lg pulse light"
          style={{ bottom: "20%", right: "10%", opacity: 0.05 }}
        />
        <FloatingLogo
          className="md sway light"
          style={{ top: "60%", left: "15%", opacity: 0.04 }}
        />
        <div className="hero-inner">
          <div className="hero-content">
            <h1>
              Creating <span>Confident Smiles</span> for Children & Adults
            </h1>
            <p>
              Modern braces and advanced aligner treatments delivered by
              experienced, trusted orthodontists in a warm and welcoming
              practice in Oldham.
            </p>
            <div className="hero-btns">
              <a href="/free-consultation" className="btn btn-accent">
                Book Your Free Consultation
              </a>
              <a href="/costs" className="btn btn-outline-light">
                Costs
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="num">100+</div>
                <div className="label">Years Experience</div>
              </div>
              <div className="hero-stat">
                <div className="num">3</div>
                <div className="label">Aligner Systems</div>
              </div>
              <div className="hero-stat">
                <div className="num">4.6<svg width="24" height="24" viewBox="0 0 24 24" fill="#f5c542" stroke="#f5c542" strokeWidth="1" style={{display: "inline", verticalAlign: "middle", marginLeft: "2px", marginBottom: "4px"}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg></div>
                <div className="label">Patient Rating</div>
              </div>
            </div>
          </div>
        </div>
        {/* Hero to Treatments curve */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, height: "140px" }}>
          <svg viewBox="0 0 1440 140" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "100%" }}>
            <path d="M0,80 C200,140 400,100 720,120 C1000,138 1200,90 1440,110 L1440,140 L0,140 Z" fill="#fff" />
          </svg>
        </div>
      </section>

      {/* TREATMENTS */}

      <section className="treatments">
        <FloatingLogo
          className="lg drift blue logo-decoration-1"
          style={{ top: "5%", right: "3%" }}
        />
        <FloatingLogo
          className="md pulse blue logo-decoration-2"
          style={{ bottom: "10%", left: "5%" }}
        />
        <div className="container">
          <div className="section-header">
            <div className="section-label">Our Treatments</div>
            <h2 className="section-title">
              Orthodontic Solutions for Every Smile
            </h2>
            <p className="section-desc">
              From traditional braces to the latest aligner technology, we offer
              a full range of treatments tailored to your needs.
            </p>
          </div>
          <div className="treatment-grid">
            <AnimatedElement>
              <div className="treatment-card">
                <div className="treatment-img-wrap">
                  <img src="/images/Braces.jpg" alt="Fixed Braces" className="treatment-bg" width={2121} height={1414} loading="lazy" />
                  <div className="treatment-overlay"></div>
                </div>
                <div className="treatment-content">
                  <h3>Fixed Braces</h3>
                  <p>
                    Proven, effective treatment for precise tooth alignment using
                    modern bracket systems.
                  </p>
                  <span className="learn-more">Braces &rarr;</span>
                </div>
              </div>
            </AnimatedElement>
            <AnimatedElement>
              <div className="treatment-card">
                <div className="treatment-img-wrap">
                  <img src="/images/Invisalign.jpg" alt="Clear Aligners" className="treatment-bg" width={2121} height={1414} loading="lazy" />
                  <div className="treatment-overlay"></div>
                </div>
                <div className="treatment-content">
                  <h3>Clear Aligners</h3>
                  <p>
                    Three advanced aligner systems for discreet, comfortable teeth
                    straightening.
                  </p>
                  <span className="learn-more">Aligners &rarr;</span>
                </div>
              </div>
            </AnimatedElement>
            <AnimatedElement>
              <div className="treatment-card">
                <div className="treatment-img-wrap">
                  <img src="/images/child.jpg" alt="Children and Teens" className="treatment-bg" width={2121} height={1414} loading="lazy" />
                  <div className="treatment-overlay"></div>
                </div>
                <div className="treatment-content">
                  <h3>Early Orthodontics</h3>
                  <p>
                    Early assessment and specialist orthodontics in a friendly,
                    relaxed environment.
                  </p>
                  <span className="learn-more">Children &rarr;</span>
                </div>
              </div>
            </AnimatedElement>
            <AnimatedElement>
              <div className="treatment-card">
                <div className="treatment-img-wrap">
                  <img src="/images/Adult.jpg" alt="Adult Orthodontics" className="treatment-bg" width={2000} height={1500} loading="lazy" />
                  <div className="treatment-overlay"></div>
                </div>
                <div className="treatment-content">
                  <h3>Adult Orthodontics</h3>
                  <p>
                    Discreet options for adults including invisible aligners and
                    lingual braces.
                  </p>
                  <span className="learn-more">Adults &rarr;</span>
                </div>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <div className="section-curve-divider" style={{ background: "#fff" }}>
        <svg viewBox="0 0 1440 140" preserveAspectRatio="none">
          <path d="M0,0 L0,60 C180,100 360,120 540,90 C720,60 900,110 1080,100 C1200,94 1340,70 1440,80 L1440,0 Z" fill="#fff" />
          <path d="M0,60 C180,100 360,120 540,90 C720,60 900,110 1080,100 C1200,94 1340,70 1440,80 L1440,140 L0,140 Z" fill="#1a1a3e" />
        </svg>
      </div>
      <section className="why-choose">
        <FloatingLogo
          className="xl drift light"
          style={{ top: "-10%", right: "-5%" }}
        />
        <FloatingLogo
          className="lg sway light"
          style={{ bottom: "5%", left: "2%" }}
        />
        <FloatingLogo
          className="md float-vertical light"
          style={{ top: "40%", right: "8%" }}
        />
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Why Choose Oldham Orthodontics?
            </h2>
          </div>
          <div className="why-grid">
            <AnimatedElement>
              <div className="why-card">
                <div className="icon">
                  <img src="/images/consultation.png" alt="Free Consultation" width={512} height={512} loading="lazy" />
                </div>
                <h3>Free Consultation</h3>
                <p>
                  Your first appointment is completely free - with no pressure
                  and no obligation. Walk away with a clear understanding of
                  your options.
                </p>
              </div>
            </AnimatedElement>
            <AnimatedElement>
              <div className="why-card">
                <div className="icon">
                  <img src="/images/medical.png" alt="Experienced Orthodontists" width={512} height={512} loading="lazy" />
                </div>
                <h3>Experienced Orthodontists</h3>
                <p>
                  Our clinicians are highly respected specialists with decades
                  of experience and a reputation for exceptional results.
                </p>
              </div>
            </AnimatedElement>
            <AnimatedElement>
              <div className="why-card">
                <div className="icon">
                  <img src="/images/aligner.png" alt="Three Aligner Systems" width={512} height={512} loading="lazy" />
                </div>
                <h3>Three Aligner Systems</h3>
                <p>
                  We offer three leading aligner brands, giving you more choice
                  and ensuring the best fit for your lifestyle and goals.
                </p>
              </div>
            </AnimatedElement>
            <AnimatedElement>
              <div className="why-card">
                <div className="icon">
                  <img src="/images/family.png" alt="Family-Friendly Practice" width={512} height={512} loading="lazy" />
                </div>
                <h3>Family-Friendly Practice</h3>
                <p>
                  We&apos;re a big family ourselves - warm, welcoming and
                  supportive. Every patient is treated like one of our own.
                </p>
              </div>
            </AnimatedElement>
            <AnimatedElement>
              <div className="why-card">
                <div className="icon">
                  <img src="/images/monitor.png" alt="Modern Technology" width={512} height={512} loading="lazy" />
                </div>
                <h3>Modern Technology</h3>
                <p>
                  Digital scanning, advanced imaging and cutting-edge treatment
                  planning for faster, more comfortable results.
                </p>
              </div>
            </AnimatedElement>
            <AnimatedElement>
              <div className="why-card">
                <div className="icon">
                  <img src="/images/accessible.png" alt="Transparent Process" width={512} height={512} loading="lazy" />
                </div>
                <h3>Transparent Process</h3>
                <p>
                  Clear pricing, written treatment summaries and a step-by-step
                  journey - you&apos;ll always know what to expect.
                </p>
              </div>
            </AnimatedElement>
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <a href="/about-us" className="btn btn-accent">About Us</a>
          </div>
        </div>
      </section>

      {/* SMILE JOURNEY */}
      <div className="section-curve-divider" style={{ background: "#1a1a3e" }}>
        <svg viewBox="0 0 1440 140" preserveAspectRatio="none">
          <path d="M0,0 L0,70 C240,110 480,40 720,70 C960,100 1140,120 1320,90 C1380,82 1420,75 1440,70 L1440,0 Z" fill="#1a1a3e" />
          <path d="M0,70 C240,110 480,40 720,70 C960,100 1140,120 1320,90 C1380,82 1420,75 1440,70 L1440,140 L0,140 Z" fill="#faf7f4" />
        </svg>
      </div>
      <section className="journey">
        <FloatingLogo
          className="lg subtle-drift coral"
          style={{ top: "10%", left: "5%" }}
        />
        <FloatingLogo
          className="xl subtle-pulse blue"
          style={{ bottom: "-15%", right: "0%" }}
        />
        <div className="container">
          <div className="section-header">
            <div className="section-label">Your Smile Journey</div>
            <h2 className="section-title">
              From First Visit to Confident Smile
            </h2>
            <p className="section-desc">
              A clear, simple path to your new smile - with support and guidance
              at every stage.
            </p>
          </div>
          <div className="journey-steps">
            <AnimatedElement>
              <div className="journey-step">
                <div className="step-num">1</div>
                <h3>Free Consultation</h3>
                <p>
                  Discuss your goals, explore treatment options and receive a
                  same-day written summary - all completely free.
                </p>
              </div>
            </AnimatedElement>
            <AnimatedElement>
              <div className="journey-step">
                <div className="step-num">2</div>
                <h3>Records Appointment</h3>
                <p>
                  X-rays, photographs and digital scans to create your
                  personalised treatment plan. Just 50 GBP, deducted from your total.
                </p>
              </div>
            </AnimatedElement>
            <AnimatedElement>
              <div className="journey-step">
                <div className="step-num">3</div>
                <h3>Treatment Begins</h3>
                <p>
                  Your custom treatment starts with regular check-ups and full
                  support from our dedicated team throughout.
                </p>
              </div>
            </AnimatedElement>
            <AnimatedElement>
              <div className="journey-step">
                <div className="step-num">4</div>
                <h3>Smile Transformation</h3>
                <p>
                  Reveal your new confident smile! We&apos;ll ensure your
                  results are maintained with retainers and aftercare.
                </p>
              </div>
            </AnimatedElement>
          </div>
          <div className="journey-cta">
            <a href="/free-consultation" className="btn btn-accent">
              Book a Free Consultation
            </a>
          </div>
        </div>
      </section>

      {/* Journey to Team curve */}
      <div className="section-curve-divider curve-tight" style={{ background: "#faf7f4" }}>
        <svg viewBox="0 0 1440 140" preserveAspectRatio="none">
          <path d="M0,0 L0,65 C200,100 450,50 720,75 C990,100 1200,110 1440,70 L1440,0 Z" fill="#faf7f4" />
          <path d="M0,65 C200,100 450,50 720,75 C990,100 1200,110 1440,70 L1440,140 L0,140 Z" fill="#f8f8f8" />
        </svg>
      </div>

      {/* TEAM */}
      <TeamSection />

      {/* Team to Reviews curve */}
      <div className="section-curve-divider" style={{ background: "#f8f8f8" }}>
        <svg viewBox="0 0 1440 140" preserveAspectRatio="none">
          <path d="M0,0 L0,55 C300,100 600,30 900,70 C1100,95 1300,110 1440,60 L1440,0 Z" fill="#f8f8f8" />
          <path d="M0,55 C300,100 600,30 900,70 C1100,95 1300,110 1440,60 L1440,140 L0,140 Z" fill="#faf7f4" />
        </svg>
      </div>

      {/* REVIEWS */}
      <section className="reviews">
        <FloatingLogo
          className="xl drift coral"
          style={{ top: "-10%", left: "-5%", opacity: 0.03 }}
        />
        <FloatingLogo
          className="md float-vertical blue"
          style={{ bottom: "20%", right: "5%" }}
        />
        <div className="container">
          <div className="section-header">
            <div className="section-label">Patient Reviews</div>
            <h2 className="section-title">Hear From Our Patients</h2>
            <p className="section-desc">
              Real stories from real patients who&apos;ve transformed their
              smiles with us.
            </p>
          </div>
          <div className="reviews-grid">
            <AnimatedElement>
              <div className="review-card">
                <div className="review-stars">*****</div>
                <p>
                  &ldquo;From the very first consultation, I felt welcomed and
                  at ease. The whole team are fantastic and my results are
                  amazing!&rdquo;
                </p>
                <div className="review-author">Sarah T.</div>
                <div className="review-source">Google Review</div>
              </div>
            </AnimatedElement>
            <AnimatedElement>
              <div className="review-card">
                <div className="review-stars">*****</div>
                <p>
                  &ldquo;Brilliant practice with a lovely friendly team. My
                  son&apos;s treatment has been smooth from start to finish.
                  Highly recommend!&rdquo;
                </p>
                <div className="review-author">James P.</div>
                <div className="review-source">Google Review</div>
              </div>
            </AnimatedElement>
            <AnimatedElement>
              <div className="review-card">
                <div className="review-stars">*****</div>
                <p>
                  &ldquo;I was nervous about getting braces as an adult but they
                  made me feel so comfortable. Best decision I&apos;ve ever made
                  for my smile.&rdquo;
                </p>
                <div className="review-author">Amina K.</div>
                <div className="review-source">Google Review</div>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      {/* Reviews to Gallery curve */}
      <div className="section-curve-divider" style={{ background: "#faf7f4" }}>
        <svg viewBox="0 0 1440 140" preserveAspectRatio="none">
          <path d="M0,0 L0,70 C180,110 420,40 660,65 C900,90 1100,120 1440,75 L1440,0 Z" fill="#faf7f4" />
          <path d="M0,70 C180,110 420,40 660,65 C900,90 1100,120 1440,75 L1440,140 L0,140 Z" fill="#f5f2ef" />
        </svg>
      </div>

      {/* GALLERY */}
      <section className="gallery">
        <FloatingLogo
          className="lg drift blue"
          style={{ top: "5%", right: "8%" }}
        />
        <FloatingLogo
          className="md pulse coral"
          style={{ bottom: "10%", left: "10%" }}
        />
        <div className="container">
          <div className="section-header">
            <div className="section-label">Patient Results</div>
            <h2 className="section-title">Real Results, Real Smiles</h2>
            <p className="section-desc">
              See the transformations we&apos;ve achieved for patients just like
              you.
            </p>
          </div>
          <div className="gallery-grid">
            <AnimatedElement>
              <BeforeAfterSlider
                label="Invisalign®"
                beforeImage="/images/results/invisalign-case-1-before.webp"
                afterImage="/images/results/invisalign-case-1-after.webp"
              />
            </AnimatedElement>
            <AnimatedElement>
              <BeforeAfterSlider
                label="Ceramic Braces"
                beforeImage="/images/results/ceramic-case-1-before.webp"
                afterImage="/images/results/ceramic-case-1-after.webp"
              />
            </AnimatedElement>
            <AnimatedElement>
              <BeforeAfterSlider
                label="Lingual Braces"
                beforeImage="/images/results/lingual-case-1-before.webp"
                afterImage="/images/results/lingual-case-1-after.webp"
              />
            </AnimatedElement>
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <a href="/results" className="btn btn-accent">Our Results</a>
          </div>
        </div>
      </section>

      {/* Gallery to Cost curve */}
      <div className="section-curve-divider" style={{ background: "#f5f2ef" }}>
        <svg viewBox="0 0 1440 140" preserveAspectRatio="none">
          <path d="M0,0 L0,60 C250,95 500,110 750,80 C1000,50 1200,90 1440,70 L1440,0 Z" fill="#f5f2ef" />
          <path d="M0,60 C250,95 500,110 750,80 C1000,50 1200,90 1440,70 L1440,140 L0,140 Z" fill="#faf7f4" />
        </svg>
      </div>

      {/* COST AND FINANCE */}
      <section className="cost-finance">
        <div className="cost-finance-container">
          <div className="cost-finance-content">
            <div className="section-label">Costs</div>
            <h2 className="cost-finance-title">
              Transparent Fees &amp; <span style={{ color: "var(--coral)" }}>Flexible Payments</span>
            </h2>
            <ul className="cost-finance-list">
              <li>
                <span className="cost-check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                Bespoke, all-inclusive pricing plans
              </li>
              <li>
                <span className="cost-check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                0% Interest payment options (0% APR)
              </li>
              <li>
                <span className="cost-check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                Initial assessment with digital simulation
              </li>
              <li>
                <span className="cost-check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                Family &amp; sibling discounts available
              </li>
            </ul>
            <div className="cost-price-card">
              <div className="cost-price-left">
                <div className="cost-price-label">Start from only</div>
                <div className="cost-price-amount">£50 <span>/week</span></div>
              </div>
              <div className="cost-price-right">
                <div className="cost-price-heading">Spread the cost</div>
                <div className="cost-price-desc">With our interest-free finance plans.</div>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: "32px" }}>
              <a href="/costs" className="btn btn-accent">Costs</a>
            </div>
          </div>
          <div className="cost-finance-image">
            <img src="/images/Cost.jpg" alt="Flexible payment plans" width={2121} height={1414} loading="lazy" />
          </div>
        </div>
      </section>

      {/* CTA PANEL */}
      <div className="section-curve-divider curve-into-cta" style={{ background: "transparent" }}>
        <svg viewBox="0 0 1440 140" preserveAspectRatio="none">
          <path d="M0,0 L0,50 C120,80 300,110 500,85 C700,60 850,100 1050,110 C1200,117 1350,90 1440,65 L1440,0 Z" fill="#faf7f4" />
        </svg>
      </div>
      <section className="cta-panel">
        <FloatingLogo
          className="xl drift light"
          style={{ top: "-20%", left: "5%" }}
        />
        <FloatingLogo
          className="lg float-vertical light"
          style={{ bottom: "-10%", right: "10%" }}
        />
        <FloatingLogo
          className="md drift light"
          style={{ top: "30%", right: "3%" }}
        />
        <div className="container">
          <h2>Ready to Start Your Smile Journey?</h2>
          <p>
            Book your free, no-obligation consultation today and take the first
            step towards the smile you&apos;ve always wanted.
          </p>
          <div className="btns">
            <a href="/free-consultation" className="btn btn-accent">
              Book Your Free Consultation
            </a>
          </div>
        </div>
      </section>

      {/* CTA to Visit curve */}
      <div className="curve-out-of-cta">
        <svg viewBox="0 0 1440 180" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "100%" }}>
          <path d="M0,80 C160,120 380,140 600,110 C820,80 1050,125 1260,135 C1360,140 1420,125 1440,115 L1440,180 L0,180 Z" fill="#faf7f4" />
        </svg>
      </div>

    </>
  );
}
