import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Photo } from "@/components/Media";
import { experiencePhotos, site } from "@/data/site";

export const metadata: Metadata = {
  title: "The XRISH Experience — XRISH CREATIVES",
  description:
    "Meet XRISH CREATIVES, an event coverage team led by Elrish John Rull in Laguna, Philippines.",
  alternates: { canonical: "/experience" },
  openGraph: {
    title: "The XRISH Experience — XRISH CREATIVES",
    description:
      "Event coverage made with heart, passion and an easygoing debut experience.",
    url: "/experience",
  },
};

export default function ExperiencePage() {
  return (
    <div id="top">
      <Header />
      <main id="main" className="experience-page">
        <section
          className="experience-hero page-pad"
          aria-labelledby="experience-title"
        >
          <h1 id="experience-title">
            <span>THE XRISH</span>
            <span>EXPERIENCE</span>
          </h1>
          <div className="experience-intro">
            <p>
              We are <strong>XRISH CREATIVES</strong> by{" "}
              <strong>Elrish John Rull</strong>, a studio specializing in{" "}
              <strong>Event Coverage</strong>. What started in 2023 as a simple
              hobby turned into a passion to capture your life events in the
              most lively and trendy way. Our goal? To deliver not just photos
              and videos, but memories that last a lifetime. For debut
              coverage, shooting with us feels fun and chill, parang laro lang,
              but rest assured, the output is always made with our heart and
              passion. <em>#thexrishexperience</em>
            </p>
            <a href="#our-way" className="experience-scroll">
              See how it feels <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section
          id="our-way"
          className="experience-story"
          aria-label="The XRISH way"
        >
          <figure className="experience-lead-photo">
            <Photo
              frame={experiencePhotos.lead}
              sizes="100vw"
              priority
              className="experience-photo"
            />
            <figcaption>
              <span>EVENT COVERAGE</span>
              <span>LAGUNA, PHILIPPINES</span>
            </figcaption>
          </figure>

          <div className="experience-pair page-pad">
            <figure className="experience-candid">
              <Photo
                frame={experiencePhotos.candid}
                sizes="(max-width: 700px) 82vw, 43vw"
                className="experience-photo"
              />
              <figcaption>
                Debut coverage feels fun and chill, parang laro lang.
              </figcaption>
            </figure>
            <div className="experience-heart">
              <h2>Made with heart and passion.</h2>
              <figure className="experience-detail">
                <Photo
                  frame={experiencePhotos.detail}
                  sizes="(max-width: 700px) 68vw, 28vw"
                  className="experience-photo"
                />
              </figure>
            </div>
          </div>
        </section>

        <section
          className="experience-contact page-pad"
          aria-labelledby="experience-contact-title"
        >
          <h2 id="experience-contact-title">Let&apos;s make it yours.</h2>
          <a
            href={site.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="experience-message"
          >
            Message Us <ArrowUpRight aria-hidden="true" />
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
