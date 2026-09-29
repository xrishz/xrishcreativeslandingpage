import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Photo } from "@/components/Media";
import { RevealHeading } from "@/components/EditorialMotion";
import { experiencePhotos } from "@/data/site";

export const metadata: Metadata = {
  title: "Frame not found | XRISH CREATIVES",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div id="top">
      <Header />
      <main id="main" className="not-found-page page-pad">
        <div className="not-found-copy">
          <span className="not-found-index">404 / FRAME NOT FOUND</span>
          <RevealHeading as="h1" lines={["This frame", "is missing."]} />
          <p>The moment you were looking for isn’t here. There’s more to see.</p>
          <div className="not-found-actions">
            <Link className="text-link" href="/">Return home <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <Link className="text-link" href="/works">Explore our work <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
        <figure className="not-found-photo">
          <Photo frame={experiencePhotos.lead} sizes="(max-width: 700px) 100vw, 48vw" />
          <figcaption>GOOD DAYS. KEPT FOREVER.</figcaption>
        </figure>
      </main>
      <Footer />
    </div>
  );
}
