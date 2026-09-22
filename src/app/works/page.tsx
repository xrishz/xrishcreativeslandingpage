import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InlineFilm } from "@/components/InlineFilm";
import { reels, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Our Works — XRISH CREATIVES",
  description:
    "Explore XRISH CREATIVES event coverage across debuts, predebuts, corporate events and graduation.",
  alternates: { canonical: "/works" },
  openGraph: {
    title: "Our Works — XRISH CREATIVES",
    description:
      "Photography and films from debuts, predebuts, corporate events and graduation.",
    url: "/works",
  },
};

const facebookPlayer = (url: string) =>
  "https://www.facebook.com/plugins/video.php?height=314&href=" +
  encodeURIComponent(url + "/") +
  "&show_text=false&width=560&t=0";

export default function WorksPage() {
  const debutFilm = reels.find((reel) => reel.category === "Debut");
  const predebutFilm = reels.find((reel) => reel.category === "Predebut");
  return (
    <div id="top">
      <Header />
      <main id="main" className="works-page">
        <section className="works-hero page-pad" aria-labelledby="works-title">
          <h1 id="works-title">
            <span>OUR</span>
            <span>WORKS</span>
          </h1>
          <nav className="works-index" aria-label="Work categories">
            {[
              ["DEBUTS", "#debuts"],
              ["PREDEBUTS", "#predebuts"],
              ["CORPORATE EVENTS", "#corporate-events"],
              ["GRADUATION", "#graduation"],
            ].map(([label, href], index) => (
              <a key={label} href={href}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {label}
                <ArrowDown size={17} aria-hidden="true" />
              </a>
            ))}
          </nav>
        </section>

        <section id="debuts" className="works-video-category page-pad">
          <div className="works-heading">
            <span>01</span>
            <h2>DEBUTS</h2>
            <p>
              Portraits, celebration, and a shoot that feels fun and chill,
              parang laro lang.
            </p>
          </div>
          <div className="works-film-list works-film-list-light">
            {debutFilm && (
              <InlineFilm
                title={debutFilm.title}
                src={facebookPlayer(debutFilm.url)}
                index={1}
                provider="Facebook"
              />
            )}
          </div>
        </section>

        <section
          id="predebuts"
          className="works-video-category works-predebuts page-pad"
        >
          <div className="works-heading">
            <span>02</span>
            <h2>PREDEBUTS</h2>
            <p>A day to explore locations and make the portraits your own.</p>
          </div>
          <div className="works-film-list works-film-list-light">
            {predebutFilm && (
              <InlineFilm
                title={predebutFilm.title}
                src={facebookPlayer(predebutFilm.url)}
                index={1}
                provider="Facebook"
              />
            )}
          </div>
        </section>

        <section id="corporate-events" className="works-film-section">
          <div className="works-heading page-pad">
            <span>03</span>
            <h2>CORPORATE EVENTS</h2>
            <p>Event coverage for teams, launches, and milestones.</p>
          </div>
          <div className="works-film-list page-pad" aria-label="Corporate films">
            <p className="works-pending">Films in preparation.</p>
          </div>
        </section>

        <section
          id="graduation"
          className="works-film-section works-graduation"
        >
          <div className="works-heading page-pad">
            <span>04</span>
            <h2>GRADUATION</h2>
            <p>Milestones, family, and the feeling of finally making it.</p>
          </div>
          <div
            className="works-film-list works-film-list-single page-pad"
            aria-label="Graduation films"
          >
            <p className="works-pending">Film in preparation.</p>
          </div>
        </section>

        <section
          className="works-contact page-pad"
          aria-labelledby="works-contact-title"
        >
          <h2 id="works-contact-title">Your event could be next.</h2>
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
