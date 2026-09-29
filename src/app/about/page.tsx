import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Photo } from "@/components/Media";
import { ReactionFilms } from "@/components/ReactionFilms";
import { ImageReveal, RevealHeading } from "@/components/EditorialMotion";
import { experiencePhotos, reactionFilms, site } from "@/data/site";

export const metadata: Metadata = {
  title: "About | XRISH CREATIVES",
  description:
    "Meet the Laguna-based photo and video team behind XRISH CREATIVES and see how our event coverage feels.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | XRISH CREATIVES",
    description:
      "Meet the team and see the moments behind an XRISH shoot.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <div id="top">
      <Header />
      <main id="main" className="experience-page">
        <section
          className="experience-hero page-pad"
          aria-labelledby="about-page-title"
        >
          <RevealHeading as="h1" id="about-page-title" lines={["ABOUT", "XRISH"]} />
          <div className="experience-intro">
            <p>
              We’re a photo and video team based in Laguna, Philippines, led
              by <strong>Elrish John Rull</strong>. What began as a hobby in 2023
              grew into <strong>XRISH CREATIVES</strong> and a love for keeping
              the people and moments of a celebration close.
            </p>
            <p>
              Our work is event coverage, from portraits to the movement of the
              day. For debuts, the shoot feels fun and chill, parang laro lang.
              We can laugh through a take and still give every frame the care
              it deserves. <em>#thexrishexperience</em>
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
            <ImageReveal><Photo
              frame={experiencePhotos.lead}
              sizes="100vw"
              priority
              className="experience-photo"
            /></ImageReveal>
            <figcaption>
              <span>EVENT COVERAGE</span>
              <span>LAGUNA, PHILIPPINES</span>
            </figcaption>
          </figure>

          <div className="experience-pair page-pad">
            <figure className="experience-candid">
              <ImageReveal><Photo
                frame={experiencePhotos.candid}
                sizes="(max-width: 700px) 82vw, 43vw"
                className="experience-photo"
              /></ImageReveal>
              <figcaption>
                Debut coverage feels fun and chill, parang laro lang.
              </figcaption>
            </figure>
            <div className="experience-heart">
              <RevealHeading lines={["Made with heart", "and passion."]} />
              <figure className="experience-detail">
                <ImageReveal><Photo
                  frame={experiencePhotos.detail}
                  sizes="(max-width: 700px) 68vw, 28vw"
                  className="experience-photo"
                /></ImageReveal>
              </figure>
            </div>
          </div>
        </section>

        <section className="experience-reactions page-pad" aria-labelledby="reactions-title">
          <div className="experience-reactions-intro">
            <span>THE FIRST WATCH</span>
            <RevealHeading id="reactions-title" lines={["Then they see it."]} />
            <p>That moment when the same-day edit plays back in the room.</p>
          </div>
          <ReactionFilms films={reactionFilms} />
        </section>

        <section
          className="experience-contact page-pad"
          aria-labelledby="experience-contact-title"
        >
          <h2 id="experience-contact-title">Let&apos;s make it yours.</h2>
          <a
            href={site.messenger}
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
