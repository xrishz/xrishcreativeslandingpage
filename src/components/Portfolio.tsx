"use client";
import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Plus,
  Play,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  stories,
  contactSheet,
  eventTypes,
  films,
  heroPortrait,
  reels,
  testimonials,
  streamPlayerUrl,
  site,
  type Story,
  type Film,
} from "@/data/site";
import { Photo } from "./Media";
import { Viewer } from "./Viewer";

export function Portfolio() {
  const [selected, setSelected] = useState<Story>();
  const [selectedFilm, setSelectedFilm] = useState<Film>();
  const strip = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: hero,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 55]);
  return (
    <>
      <section
        className="hero page-pad"
        ref={hero}
        aria-labelledby="hero-heading"
      >
        <div className="hero-copy">
          <h1 id="hero-heading">
            <span>XRISH</span>
            <span>CREATIVES</span>
          </h1>
          <p>
            Photo & film for celebrations
            <br />
            worth seeing again.
          </p>
          <a href="#work" className="text-link">
            Explore our work <ArrowDown size={18} aria-hidden="true" />
          </a>
        </div>
        <motion.div
          className="hero-portrait"
          style={reduced ? undefined : { y: portraitY }}
        >
          <Photo
            frame={heroPortrait}
            sizes="(max-width: 700px) 100vw, 68vw"
            priority
          />
          <div className="hero-portrait-blend" aria-hidden="true" />
        </motion.div>
        <div className="hero-bottom">
          <span>
            PHOTOGRAPHY + FILMS
            <br />
            BASED IN LAGUNA, PHILIPPINES
          </span>
          <a href="#work" className="hero-preview">
            <div className="hero-preview-photo">
              <Photo
                frame={stories[0].cover}
                sizes="(max-width: 700px) 100vw, 110px"
                priority
              />
            </div>
            <span>
              Real people.
              <br />
              Really good memories.
            </span>
            <ArrowDown size={22} aria-hidden="true" />
          </a>
          <span className="hero-scroll">
            SCROLL TO EXPLORE <ArrowDown size={14} aria-hidden="true" />
          </span>
        </div>
      </section>

      <section
        id="work"
        className="work-section"
        aria-labelledby="work-heading"
      >
        <div className="section-heading page-pad">
          <h2 id="work-heading">
            Selected stories<span className="heading-period">.</span>
          </h2>
          <p>
            A few moments.
            <br />A lot of feeling.
          </p>
        </div>
        <article className="lead-story">
          <button
            className="story-image lead-image"
            onClick={() => setSelected(stories[0])}
            aria-label={`View ${stories[0].title}`}
          >
            <Photo frame={stories[0].cover} sizes="100vw" />
            <span className="image-view">
              <Plus size={20} /> View story
            </span>
            <span className="lead-caption">
              For the days
              <br />
              you want to keep.
            </span>
          </button>
          <div className="story-meta page-pad">
            <div>
              <h3>{stories[0].title}</h3>
              <span>{stories[0].subtitle}</span>
            </div>
            <button
              className="icon-button"
              onClick={() => setSelected(stories[0])}
              aria-label={`Open ${stories[0].title}`}
            >
              <ArrowUpRight />
            </button>
          </div>
        </article>
        <div className="story-spread page-pad">
          {stories.slice(1).map((story, index) => (
            <article key={story.slug} className={`story story-${index}`}>
              <button
                className="story-image"
                onClick={() => setSelected(story)}
                aria-label={`View ${story.title}`}
              >
                <Photo
                  frame={story.cover}
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
                <span className="image-view">
                  <Plus size={20} /> View story
                </span>
              </button>
              <div className="story-meta">
                <div>
                  <h3>{story.title}</h3>
                  <span>{story.subtitle}</span>
                </div>
                <button
                  className="icon-button"
                  onClick={() => setSelected(story)}
                  aria-label={`Open ${story.title}`}
                >
                  <ArrowUpRight />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="films"
        className="films-section"
        aria-labelledby="films-heading"
      >
        <div className="film-top page-pad">
          <h2 id="films-heading">
            You had to
            <br />
            be there.
          </h2>
          <p>
            Or press play.
            <br />
            The movement. The voices.
            <br />
            The feeling, all over again.
          </p>
        </div>
        <div className="reel-heading page-pad">
          <div>
            <h3>Watch the moments move.</h3>
          </div>
        </div>
        <div className="reel-gallery page-pad">
          {reels.filter((reel) => reel.embeddable).map((reel, index) => (
            <article className="reel-feature" key={reel.url}>
              <div className="reel-frame">
                <iframe
                  title={`${reel.title} — Facebook video player`}
                  src={`https://www.facebook.com/plugins/video.php?height=314&href=${encodeURIComponent(`${reel.url}/`)}&show_text=false&width=560&t=0`}
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="reel-feature-caption">
                <span>{String(index + 1).padStart(2, "0")} / {reel.category}</span>
                <h4>{reel.title}</h4>
              </div>
              <a href={reel.url} target="_blank" rel="noopener noreferrer">
                Open original on Facebook <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
        {films.map((film) => (
          <article key={film.slug} className="film-feature page-pad">
            <div className="film-photo">
              <Photo frame={film.poster} sizes="100vw" />
              <div className="film-scrim" />
              <div className="film-caption">
                <h3>{film.title}</h3>
                {streamPlayerUrl(film) ? (
                  <button
                    className="film-link"
                    onClick={() => setSelectedFilm(film)}
                  >
                    <span className="play-circle">
                      <Play size={26} aria-hidden="true" />
                    </span>
                    <span>
                      Watch full film
                      {film.duration ? ` · ${film.duration}` : ""}
                    </span>
                  </button>
                ) : (
                  <div className="film-coming-soon">
                    <p>Coming soon.</p>
                    <span>A story before the celebration.</span>
                  </div>
                )}
                <a
                  className="film-link"
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="play-circle">
                    <ArrowUpRight size={28} aria-hidden="true" />
                  </span>
                  <span>More from XRISH on Facebook</span>
                </a>
              </div>
            </div>
          </article>
        ))}
        <div className="film-foot page-pad">
          <span>EVENT FILMS, MADE TO BE FELT.</span>
          <span>PHOTOGRAPHY / CINEMATOGRAPHY</span>
        </div>
      </section>

      <section className="approach-section" aria-labelledby="approach-heading">
        <div className="approach-intro page-pad">
          <h2 id="approach-heading">
            More than
            <br />
            the main event.
          </h2>
          <div>
            <p>
              The anticipation. The little details. The look that lasts a
              second.
            </p>
            <p>We’re looking for the moments that make the day yours.</p>
          </div>
        </div>
        <div className="strip-title page-pad">
          <span>A DAY IN FRAMES</span>
          <div>
            <button
              className="icon-button"
              onClick={() =>
                strip.current?.scrollBy({
                  left: -360,
                  behavior: reduced ? "instant" : "smooth",
                })
              }
              aria-label="Scroll photographs left"
            >
              <ArrowLeft />
            </button>
            <button
              className="icon-button"
              onClick={() =>
                strip.current?.scrollBy({
                  left: 360,
                  behavior: reduced ? "instant" : "smooth",
                })
              }
              aria-label="Scroll photographs right"
            >
              <ArrowRight />
            </button>
          </div>
        </div>
        <div
          ref={strip}
          className="photo-strip"
          tabIndex={0}
          aria-label="A day in frames, horizontally scrollable photographs"
        >
          {contactSheet.map((frame, index) => (
            <figure key={frame.image.src}>
              <div className="strip-photo">
                <Photo frame={frame} sizes="(max-width: 700px) 72vw, 320px" />
              </div>
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {
                  [
                    "The details",
                    "The personality",
                    "The quiet",
                    "The energy",
                    "The after hours",
                    "The whole feeling",
                  ][index]
                }
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section
        className="coverage-section page-pad"
        aria-labelledby="coverage-heading"
      >
        <div className="coverage-intro">
          <h2 id="coverage-heading">
            Whatever
            <br />
            you’re celebrating.
          </h2>
          <p>
            Big milestones. Small gatherings.
            <br />
            Your people, together.
          </p>
          <a
            href={site.facebook}
            className="text-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Message Us <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="event-list">
          {eventTypes.map((type) => (
            <a
              key={type}
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{type}</span>
              <ArrowUpRight size={24} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section
        id="testimonials"
        className="testimonials-section page-pad"
        aria-labelledby="testimonials-heading"
      >
        <div className="testimonials-heading">
          <div>
            <span className="section-eyebrow">NOTES FROM OUR CLIENTS</span>
            <h2 id="testimonials-heading">
              Kind words.
              <br />
              Kept close.
            </h2>
          </div>
          <p>What it felt like, in their own words.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <figure
              className={`testimonial testimonial-${index}`}
              key={testimonial.name}
            >
              <span className="testimonial-index">
                {String(index + 1).padStart(2, "0")} / 03
              </span>
              <blockquote>
                {testimonial.quote.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </blockquote>
              <figcaption>{testimonial.name} <span>· Client</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section
        id="about"
        className="about-section page-pad"
        aria-labelledby="about-heading"
      >
        <div className="about-title">
          <h2 id="about-heading">
            Small team.
            <br />
            Big days.
          </h2>
          <span>THIS IS XRISH CREATIVES.</span>
        </div>
        <div className="about-copy">
          <p>
            We’re a photo and video team based in Laguna, Philippines, led by
            Elrish John Rull.
          </p>
          <p>
            We document celebrations and the people who make them matter. From
            the first preparations to the last frame, we’re there to turn your
            day into something you can come back to.
          </p>
          <a
            className="text-link"
            href={site.facebook}
            target="_blank"
            rel="noopener noreferrer"
          >
            Message Us <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="about-image">
          <Photo
            frame={{ ...contactSheet[4], position: "50% 35%" }}
            sizes="100vw"
          />
          <span>THE WAY WE SEE IT.</span>
        </div>
      </section>

      <section
        id="contact"
        className="contact-section page-pad"
        aria-labelledby="contact-heading"
      >
        <div className="contact-top">
          <p>
            Tell us what you’re planning.
            <br />
            We’ll take it from there.
          </p>
        </div>
        <h2 id="contact-heading">
          LET’S MAKE
          <br />
          IT A MEMORY.
        </h2>
        <a
          className="contact-action"
          href={site.facebook}
          target="_blank"
          rel="noopener noreferrer"
        >
          Message Us <ArrowUpRight aria-hidden="true" />
        </a>
        <div className="contact-note">
          <span>Debut. Predebut. Weddings. Corporate Events. Graduations.</span>
          <span>Let’s talk on Facebook.</span>
        </div>
      </section>
      {selected && (
        <Viewer
          key={selected.slug}
          story={selected}
          close={() => setSelected(undefined)}
        />
      )}
      {selectedFilm && (
        <Viewer
          key={selectedFilm.slug}
          film={selectedFilm}
          close={() => setSelectedFilm(undefined)}
        />
      )}
    </>
  );
}
