import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqList } from "@/components/FaqList";
import { RevealHeading } from "@/components/EditorialMotion";
import { faqs } from "@/data/faq";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "FAQs | XRISH CREATIVES",
  description: "Booking, coverage, delivery and other common questions about working with XRISH CREATIVES.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQs | XRISH CREATIVES",
    description: "The details to know before your day: booking, coverage and delivery.",
    url: "/faq",
  },
};

export default function FaqPage() {
  return (
    <div id="top">
      <Header />
      <main id="main" className="faq-page page-pad">
        <div className="faq-page-intro">
          <span className="faq-eyebrow">BEFORE WE BEGIN</span>
          <RevealHeading as="h1" lines={["Good questions.", "Clear answers."]} />
          <p>How we book, what we cover, and what happens after the day.</p>
        </div>
        <FaqList items={faqs} />
        <div className="faq-page-end">
          <p>These answers summarize our terms. Your signed contract and confirmed package govern your booking.</p>
          <a href={site.messenger} target="_blank" rel="noopener noreferrer">
            Inquire on Messenger <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
