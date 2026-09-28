"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Pause,
  Plus,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
} from "motion/react";
import {
  stories,
  contactSheet,
  eventTypes,
  films,
  previewFilms,
  testimonials,
  streamPlayerUrl,
  site,
  type Story,
  type Film,
} from "@/data/site";
import { Photo } from "./Media";
import { Viewer } from "./Viewer";
import { LatestFacebookFilm } from "./LatestFacebookFilm";
import { CinematicFilm } from "./CinematicFilm";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRotatingHeroFilm } from "@/hooks/useRotatingHeroFilm";
import { claimVideoSound, VIDEO_SOUND_EVENT } from "@/lib/video-coordination";

export function Portfolio() {
  const [selected, setSelected] = useState<Story>();
  const [selectedFilm, setSelectedFilm] = useState<Film>();
  const [leadPhotoIndex, setLeadPhotoIndex] = useState(0);
  const [leadPaused, setLeadPaused] = useState(false);
  const [leadHovered, setLeadHovered] = useState(false);
  const [leadFocused, setLeadFocused] = useState(false);
  const [heroMuted, setHeroMuted] = useState(true);
  const [heroPaused, setHeroPaused] = useState(false);
  const strip = useRef<HTMLDivElement>(null);
  const heroVideo = useRef<HTMLVideoElement>(null);
  const heroRoot = useRef<HTMLElement>(null);
  const heroManuallyPaused = useRef(false);
  const reduced = useHydratedReducedMotion();
  const heroFilm = useRotatingHeroFilm();
  const heroAppearsPaused = reduced || heroPaused;
  useEffect(() => {
    if (!reduced) return;
    heroVideo.current?.pause();
  }, [reduced]);
  useEffect(() => {
    const muteWhenAnotherFilmSpeaks = (event: Event) => {
      const source = (event as CustomEvent<{ source?: string }>).detail?.source;
      if (source === "hero") return;
      const video = heroVideo.current;
      if (!video) return;
      video.muted = true;
      setHeroMuted(true);
    };
    window.addEventListener(VIDEO_SOUND_EVENT, muteWhenAnotherFilmSpeaks);
    return () => window.removeEventListener(VIDEO_SOUND_EVENT, muteWhenAnotherFilmSpeaks);
  }, []);
  useEffect(() => {
    const root = heroRoot.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => {
      const video = heroVideo.current;
      if (!video || reduced) return;
      if (!entry.isIntersecting) video.pause();
      else if (!heroManuallyPaused.current) video.play().catch(() => undefined);
    }, { threshold: 0.05 });
    observer.observe(root);
    return () => observer.disconnect();
  }, [reduced]);
  const leadLandscapes = stories[0].gallery.filter(
    (frame) => frame.image.width > frame.image.height,
  );
  useEffect(() => {
    if (
      reduced ||
      leadPaused ||
      leadHovered ||
      leadFocused ||
      leadLandscapes.length < 2
    )
      return;
    const timer = window.setInterval(
      () =>
        setLeadPhotoIndex((current) => (current + 1) % leadLandscapes.length),
      5000,
    );
    return () => window.clearInterval(timer);
  }, [
    leadFocused,
    leadHovered,
    leadLandscapes.length,
    leadPaused,
    reduced,
  ]);
  const leadPhoto = leadLandscapes[leadPhotoIndex] ?? stories[0].cover;
  return (
    <>
      <section
        ref={heroRoot}
        className="hero page-pad"
        aria-labelledby="hero-heading"
      >
        <div className="hero-film" aria-hidden="true">
          <video
            key={heroFilm.src}
            ref={heroVideo}
            src={heroFilm.src}
            poster={heroFilm.poster}
            autoPlay={!reduced}
            muted
            loop
            playsInline
            preload="auto"
            onPlay={() => setHeroPaused(false)}
            onPause={() => setHeroPaused(true)}
          />
          <div className="hero-film-blend" />
        </div>
        <div className="hero-copy">
          <h1 id="hero-heading">
            <motion.span
              initial={reduced ? false : { y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
            >
              XRISH
            </motion.span>
            <motion.span
              initial={reduced ? false : { y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, delay: 1.34, ease: [0.16, 1, 0.3, 1] }}
            >
              CREATIVES
            </motion.span>
          </h1>
          <p>
            Photo and film for the days
            <br />that gather everyone you love.
          </p>
          <Link href="/works" className="text-link">
            Explore our work <ArrowDown size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="hero-bottom">
          <span>
            PHOTOGRAPHY + FILMS
            <br />
            BASED IN LAGUNA, PHILIPPINES
          </span>
          <Link href="/works" className="hero-preview">
            <span>
              Real people.
              <br />
              Really good memories.
            </span>
            <ArrowDown size={22} aria-hidden="true" />
          </Link>
          <span className="hero-scroll">
            SCROLL TO EXPLORE <ArrowDown size={14} aria-hidden="true" />
          </span>
          <div className="hero-film-controls">
            <button
              type="button"
              onClick={() => {
                const video = heroVideo.current;
                if (!video) return;
                video.muted = !video.muted;
                setHeroMuted(video.muted);
                if (!video.muted) claimVideoSound("hero");
                if (video.paused) {
                  heroManuallyPaused.current = false;
                  video.play().then(() => setHeroPaused(false)).catch(() => setHeroPaused(true));
                }
              }}
              aria-label={heroMuted ? "Turn on hero film sound" : "Mute hero film"}
            >
              {heroMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              {heroMuted ? "Sound" : "Sound on"}
            </button>
            <button
              type="button"
              onClick={() => {
                const video = heroVideo.current;
                if (!video) return;
                if (video.paused) {
                  heroManuallyPaused.current = false;
                  video.play().then(() => setHeroPaused(false)).catch(() => setHeroPaused(true));
                }
                else {
                  heroManuallyPaused.current = true;
                  video.pause();
                  setHeroPaused(true);
                }
              }}
              aria-label={heroAppearsPaused ? "Play hero film" : "Pause hero film"}
            >
              {heroAppearsPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
            </button>
          </div>
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
        <article
          className="lead-story"
          onMouseEnter={() => setLeadHovered(true)}
          onMouseLeave={() => setLeadHovered(false)}
          onFocusCapture={() => setLeadFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setLeadFocused(false);
          }}
        >
          <button
            className="story-image lead-image"
            onClick={() => setSelected(stories[0])}
            aria-label={`View ${stories[0].title}`}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={leadPhoto.image.src}
                className="lead-rotation-frame"
                data-frame={leadPhoto.image.src}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Photo frame={leadPhoto} sizes="100vw" />
              </motion.div>
            </AnimatePresence>
            <span className="image-view">
              <Plus size={20} /> View story
            </span>
            <span className="lead-caption">
              For the days
              <br />
              you want to keep.
            </span>
          </button>
          <div className="lead-rotation-control">
            <span aria-live="polite">
              {String(leadPhotoIndex + 1).padStart(2, "0")} /{" "}
              {String(leadLandscapes.length).padStart(2, "0")}
            </span>
            {!reduced && (
              <button
                type="button"
                onClick={() => setLeadPaused((current) => !current)}
                aria-pressed={leadPaused}
                aria-label={
                  leadPaused
                    ? "Resume landscape rotation"
                    : "Pause landscape rotation"
                }
              >
                {leadPaused ? (
                  <Play size={14} fill="currentColor" aria-hidden="true" />
                ) : (
                  <Pause size={14} fill="currentColor" aria-hidden="true" />
                )}
                {leadPaused ? "Resume" : "Pause"}
              </button>
            )}
          </div>
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
          <motion.h2
            id="films-heading"
            initial={reduced ? false : { y: 70, filter: "blur(8px)" }}
            whileInView={{ y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            The moments
            <br />still move.
          </motion.h2>
          <p>
            The glance before the pose. The laughter between takes. The energy
            of the room, kept in motion.
          </p>
        </div>
        <div className="cinematic-gallery page-pad">
          {previewFilms.map((film, index) => (
            <CinematicFilm key={film.slug} film={film} priority={index === 0} />
          ))}
        </div>
        <LatestFacebookFilm />
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
                    "The preparation",
                    "The details",
                    "The personality",
                    "The quiet",
                    "The energy",
                    "The after hours",
                    "The whole feeling",
                    "The reflection",
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
            frame={{ ...contactSheet[5], position: "50% 35%" }}
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
