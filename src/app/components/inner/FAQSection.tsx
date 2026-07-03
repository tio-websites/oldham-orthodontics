"use client";

import React, { useState } from "react";

type FAQ = { question: string; answer: React.ReactNode };

// Recursively flatten a ReactNode (answers often contain JSX with <a> links)
// to plain text for FAQPage structured data.
function nodeToText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (React.isValidElement(node)) {
    return nodeToText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}

type FAQSectionProps = {
  label?: string;
  title?: string;
  description?: string;
  faqs: FAQ[];
};

function FAQItem({ question, answer }: { question: string; answer: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`faq-icon ${isOpen ? "rotate" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && <div className="faq-answer">{answer}</div>}
    </div>
  );
}

export default function FAQSection({
  label = "COMMON QUESTIONS",
  title = "Frequently Asked Questions",
  description = "Find answers to the most common questions about orthodontic treatment.",
  faqs,
}: FAQSectionProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: nodeToText(f.question).trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: nodeToText(f.answer).trim(),
      },
    })),
  };

  return (
    <section className="faq-section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="faq-container">
        <div className="faq-header">
          <span className="faq-label">{label}</span>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
