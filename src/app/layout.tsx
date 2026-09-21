import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});
export const metadata: Metadata = {
  ...(site.url
    ? { metadataBase: new URL(site.url), alternates: { canonical: "/" } }
    : {}),
  title: "XRISH CREATIVES — Event Photography & Films",
  description:
    "Photo and film coverage for celebrations worth seeing again. Explore XRISH CREATIVES: debut, predebut, weddings, corporate events and graduations in Laguna, Philippines.",
  openGraph: {
    title: "XRISH CREATIVES — Event Photography & Films",
    description:
      "Photography + films for celebrations worth seeing again. Based in Laguna, Philippines.",
    type: "website",
    locale: "en_PH",
    siteName: "XRISH CREATIVES",
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#f5f4f0" };
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const business = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: "Event photography and videography based in Laguna, Philippines",
    areaServed: "Philippines",
    address: {
      "@type": "PostalAddress",
      addressRegion: "Laguna",
      addressCountry: "PH",
    },
    sameAs: [site.facebook],
    ...(site.url ? { url: site.url } : {}),
  };
  return (
    <html lang="en" className={instrument.variable}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(business).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
