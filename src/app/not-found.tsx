import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "100px 24px",
        background: "#faf7f4",
      }}
    >
      <p style={{ fontSize: 15, fontWeight: 700, letterSpacing: 2, color: "#e8a44a", marginBottom: 16 }}>
        ERROR 404
      </p>
      <h1 style={{ fontSize: 42, fontWeight: 400, color: "#1a1a3e", marginBottom: 20, lineHeight: 1.2 }}>
        We couldn&apos;t find that page
      </h1>
      <p style={{ fontSize: 16, color: "#3a3a4a", lineHeight: 1.7, maxWidth: 520, marginBottom: 36 }}>
        The page you&apos;re looking for may have moved or no longer exists. Let&apos;s get you back on track.
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" className="btn btn-accent">Back to home</Link>
        <Link href="/free-consultation" className="btn btn-accent">Book a free consultation</Link>
      </div>
    </section>
  );
}
