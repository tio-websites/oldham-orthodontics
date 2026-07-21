import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import VisitSection from "./components/VisitSection";
import CookieConsent from "./components/CookieConsent";
import Analytics from "./components/Analytics";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.oldhamorthodontics.co.uk"),
  title: {
    default: "Oldham Orthodontics | Specialist Orthodontic Care in Oldham",
    template: "%s | Oldham Orthodontics",
  },
  description: "Modern braces and advanced aligner treatments delivered by experienced, trusted orthodontists in a warm and welcoming practice in Oldham. Book your free consultation today.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Oldham Orthodontics",
    title: "Oldham Orthodontics | Specialist Orthodontic Care in Oldham",
    description: "Modern braces and advanced aligner treatments delivered by experienced, trusted orthodontists in a warm and welcoming practice in Oldham.",
    url: "https://www.oldhamorthodontics.co.uk",
    images: [
      {
        url: "/images/about-us-hero.webp",
        width: 854,
        height: 683,
        alt: "The welcoming reception of the Oldham Orthodontics practice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oldham Orthodontics | Specialist Orthodontic Care in Oldham",
    description: "Modern braces and advanced aligner treatments delivered by experienced, trusted orthodontists in Oldham.",
    images: ["/images/about-us-hero.webp"],
  },
  alternates: {
    canonical: "https://www.oldhamorthodontics.co.uk",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const practiceSchema = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: "Oldham Orthodontics",
  url: "https://www.oldhamorthodontics.co.uk",
  logo: "https://www.oldhamorthodontics.co.uk/images/oldham-logo.png",
  image: "https://www.oldhamorthodontics.co.uk/images/about-us-hero.webp",
  telephone: "+44 161 622 0987",
  email: "info@oldhamorthodontics.co.uk",
  medicalSpecialty: "Orthodontic",
  priceRange: "££",
  address: {
    "@type": "PostalAddress",
    streetAddress: "221 Hollins Road",
    addressLocality: "Oldham",
    postalCode: "OL8 3AA",
    addressCountry: "GB",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 53.5408,
    longitude: -2.1047,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "17:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Tuesday", opens: "09:00", closes: "18:00" },
  ],
  sameAs: [
    "https://www.facebook.com/OldhamOrthodontics",
    "https://www.youtube.com/channel/UC6v5MtYOziWoEu9ZU6TH9gA",
    "https://twitter.com/OrthoOldham",
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Oldham Orthodontics",
  url: "https://www.oldhamorthodontics.co.uk",
  logo: "https://www.oldhamorthodontics.co.uk/images/oldham-logo.png",
  sameAs: [
    "https://www.facebook.com/OldhamOrthodontics",
    "https://www.youtube.com/channel/UC6v5MtYOziWoEu9ZU6TH9gA",
    "https://twitter.com/OrthoOldham",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        {/* Google Tag Manager (noscript) — first-party via GTG. JS-disabled fallback. */}
        <noscript>
          <iframe
            src="/v2ur/ns.html?id=GTM-TRC7LX45"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="gtm"
          />
        </noscript>
        <Script
          src="https://www.bugherd.com/sidebarv2.js?apikey=m0sczixxlaa9gfw9pygzya"
          strategy="afterInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(practiceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <SiteHeader />
        {children}
        <VisitSection />
        <SiteFooter />
        <CookieConsent />
        <Analytics />
        {/* PRM/GA4 attribution — feeds custom14–custom20 on form.ajax_form submit. */}
        <Script src="/js/prm-attribution.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
