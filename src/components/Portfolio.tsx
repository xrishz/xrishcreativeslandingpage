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
  heroPortrait,
  films,
  previewFilms,
  testimonials,
  streamPlayerUrl,
  site,
  streamCustomerCode,
  type Story,
  type Film,
} from "@/data/site";
import { Photo } from "./Media";
import { Viewer } from "./Viewer";
import { LatestFacebookFilm } from "./LatestFacebookFilm";
import { CinematicFilm } from "./CinematicFilm";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRotatingHeroFilm } from "@/hooks/useRotatingHeroFilm";
import { useStreamVideo } from "@/hooks/useStreamVideo";
import { claimVideoSound, VIDEO_SOUND_EVENT } from "@/lib/video-coordination";
import { hostedImageUrl } from "@/lib/cloudflare-images";

export function Portfolio() {
  const [selected, setSelected] = useState<Story>();
  const [selectedFilm, setSelectedFilm] = useState<Film>();
  const [leadPhotoIndex, setLeadPhotoIndex] = useState(0);
  const [leadPaused, setLeadPaused] = useState(false);
  const [leadHovered, setLeadHovered] = useState(false);
  const [leadFocused, setLeadFocused] = useState(false);
  const [heroMuted, setHeroMuted] = useState(true);
  const [heroPaused, setHeroPaused] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [stripPaused, setStripPaused] = useState(false);
  const strip = useRef<HTMLDivElement>(null);
  const stripManuallyPaused = useRef(false);
  const stripPauseUntil = useRef(0);
  const stripDrag = useRef<{ pointerId: number; lastX: number } | null>(null);
  const stripTouchActive = useRef(false);
  const testimonialTrack = useRef<HTMLDivElement>(null);
  const testimonialScrollLocked = useRef(false);
  const testimonialUnlockTimer = useRef<number | undefined>(undefined);
  const heroVideo = useRef<HTMLVideoElement>(null);
  const heroRoot = useRef<HTMLElement>(null);
  const heroManuallyPaused = useRef(false);
  const reduced = useHydratedReducedMotion();
  const heroFilm = useRotatingHeroFilm();
  useStreamVideo(heroVideo, heroFilm.streamVideoId, streamCustomerCode, heroFilm.src, true);
  const heroAppearsPaused = reduced || heroPaused;
  const showTestimonial = (index: number) => {
    const next = (index + testimonials.length) % testimonials.length;
    setTestimonialIndex(next);
    testimonialScrollLocked.current = true;
    window.clearTimeout(testimonialUnlockTimer.current);
    testimonialUnlockTimer.current = window.setTimeout(() => {
      testimonialScrollLocked.current = false;
    }, reduced ? 0 : 650);
    const track = testimonialTrack.current;
    const card = track?.children[next] as HTMLElement | undefined;
    if (track && card) {
      track.scrollTo({
        left: card.offsetLeft - track.offsetLeft,
        behavior: reduced ? "auto" : "smooth",
      });
    }
  };
  const changeTestimonial = (direction: number) => {
    showTestimonial(testimonialIndex + direction);
  };
  useEffect(() => {
    return () => window.clearTimeout(testimonialUnlockTimer.current);
  }, []);
  useEffect(() => {
    if (!reduced) return;
    heroVideo.current?.pause();
  }, [reduced]);
  useEffect(() => {
    const track = strip.current;
    if (!track) return;
    let cycleWidth = 0;
    let frame = 0;
    let lastFrame = 0;
    let scrollPosition = track.scrollLeft;

    const measure = () => {
      const first = track.children[0] as HTMLElement | undefined;
      const repeat = track.children[contactSheet.length] as HTMLElement | undefined;
      if (!first || !repeat) return;
      const nextWidth = repeat.offsetLeft - first.offsetLeft;
      if (nextWidth <= 0 || nextWidth === cycleWidth) return;
      const previousWidth = cycleWidth;
      cycleWidth = nextWidth;
      track.scrollLeft = previousWidth
        ? track.scrollLeft + nextWidth - previousWidth
        : nextWidth;
      scrollPosition = track.scrollLeft;
    };
    const wrap = () => {
      if (!cycleWidth) return;
      if (track.scrollLeft < cycleWidth) {
        track.scrollLeft += cycleWidth;
        scrollPosition = track.scrollLeft;
      } else if (track.scrollLeft >= cycleWidth * 2) {
        track.scrollLeft -= cycleWidth;
        scrollPosition = track.scrollLeft;
      }
    };
    const tick = (now: number) => {
      const elapsed = Math.min(now - lastFrame, 64);
      lastFrame = now;
      if (
        !document.hidden &&
        !stripManuallyPaused.current &&
        !stripDrag.current &&
        !stripTouchActive.current &&
        now > stripPauseUntil.current
      ) {
        scrollPosition += elapsed * 0.06;
        track.scrollLeft = scrollPosition;
      } else scrollPosition = track.scrollLeft;
      frame = window.requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      window.cancelAnimationFrame(frame);
      if (entry.isIntersecting && !reduced) {
        scrollPosition = track.scrollLeft;
        lastFrame = performance.now();
        frame = window.requestAnimationFrame(tick);
      }
    });
    const resize = new ResizeObserver(measure);
    measure();
    resize.observe(track);
    track.addEventListener("scroll", wrap, { passive: true });
    observer.observe(track);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      track.removeEventListener("scroll", wrap);
    };
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
  const scrollStrip = (distance: number) => {
    stripPauseUntil.current = performance.now() + 1200;
    strip.current?.scrollBy({
      left: distance,
      behavior: reduced ? "instant" : "smooth",
    });
  };
  const finishStripDrag = (pointerId: number, target: HTMLDivElement) => {
    if (stripDrag.current?.pointerId !== pointerId) return;
    stripDrag.current = null;
    stripPauseUntil.current = performance.now() + 1200;
    if (target.hasPointerCapture(pointerId)) target.releasePointerCapture(pointerId);
  };
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
            data-film-src={heroFilm.src}
            data-stream-id={heroFilm.streamVideoId}
            poster={hostedImageUrl(heroFilm.poster, 1920) ?? heroFilm.poster}
            autoPlay={!reduced}
            muted
            loop
            playsInline
            preload="auto"
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            disableRemotePlayback
            draggable={false}
            onContextMenu={(event) => event.preventDefault()}
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
          <div className="cinematic-lead-story">
            <CinematicFilm film={previewFilms[0]} priority />
            <motion.aside
              className="film-story"
              initial={reduced ? false : { y: 34 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              aria-labelledby="film-story-heading"
            >
              <span>Behind the film</span>
              <h3 id="film-story-heading">A good frame can start with a joke.</h3>
              <p>
                Between takes, we played around, traded jokes, and let the shoot
                feel easy. Nothing too serious or strict—just our team and the
                debutant enjoying the afternoon while the real moments found
                their way into the film.
              </p>
              <p>
                The energy stays light. The care behind the final work never
                does.
              </p>
            </motion.aside>
          </div>
          {previewFilms.slice(1).map((film) => (
            <CinematicFilm key={film.slug} film={film} />
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
        </div>
        <div
          ref={strip}
          className="photo-strip"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={`A day in frames. Drag or swipe to browse. Press Space to ${stripPaused ? "resume" : "pause"} the moving photographs, or use the arrow keys.`}
          aria-keyshortcuts="Space ArrowLeft ArrowRight"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              scrollStrip(event.key === "ArrowLeft" ? -360 : 360);
            } else if (event.key === " ") {
              event.preventDefault();
              stripManuallyPaused.current = !stripManuallyPaused.current;
              setStripPaused(stripManuallyPaused.current);
            }
          }}
          onWheel={() => (stripPauseUntil.current = performance.now() + 1200)}
          onPointerDown={(event) => {
            if (event.pointerType === "touch") {
              stripTouchActive.current = true;
              return;
            }
            if (event.button !== 0) return;
            stripDrag.current = { pointerId: event.pointerId, lastX: event.clientX };
            event.currentTarget.setPointerCapture(event.pointerId);
            event.preventDefault();
          }}
          onPointerMove={(event) => {
            const drag = stripDrag.current;
            if (drag?.pointerId !== event.pointerId) return;
            event.currentTarget.scrollLeft -= event.clientX - drag.lastX;
            drag.lastX = event.clientX;
          }}
          onPointerUp={(event) => {
            if (event.pointerType === "touch") {
              stripTouchActive.current = false;
              stripPauseUntil.current = performance.now() + 1200;
            } else finishStripDrag(event.pointerId, event.currentTarget);
          }}
          onPointerCancel={(event) => {
            if (event.pointerType === "touch") {
              stripTouchActive.current = false;
              stripPauseUntil.current = performance.now() + 1200;
            } else finishStripDrag(event.pointerId, event.currentTarget);
          }}
        >
          {Array.from({ length: 3 }, (_, cycle) =>
            contactSheet.map((frame, index) => (
            <figure key={`${cycle}-${frame.image.src}`} aria-hidden={cycle !== 1}>
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
          ))) }
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
          <Link
            href="/works#predebuts"
            className="coverage-image"
            aria-label="Explore predebut films"
          >
            <Photo frame={heroPortrait} sizes="(max-width: 700px) 90vw, 40vw" />
            <span>
              Explore the films <ArrowUpRight size={18} aria-hidden="true" />
            </span>
          </Link>
        </div>
        <div className="event-list">
          {eventTypes.map((type) => {
            const href = `/works#${
                  {
                    Debut: "debuts",
                    Predebut: "predebuts",
                    "Corporate Events": "corporate-events",
                    Graduations: "graduation",
                  }[type]
                }`;
            return (
            <a
              key={type}
              href={href}
              aria-label={`Explore ${type} films`}
            >
              <span>{type}</span>
              <ArrowUpRight size={24} aria-hidden="true" />
            </a>
          )})}
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
        <div
          className="testimonial-carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="Client feedback"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") changeTestimonial(-1);
            if (event.key === "ArrowRight") changeTestimonial(1);
          }}
        >
          <div
            ref={testimonialTrack}
            className="testimonial-track"
            tabIndex={0}
            aria-label="Client note cards; scroll horizontally"
            onScroll={(event) => {
              if (testimonialScrollLocked.current) return;
              const track = event.currentTarget;
              const cards = Array.from(track.children) as HTMLElement[];
              const closest = cards.reduce(
                (best, card, index) => {
                  const distance = Math.abs(card.offsetLeft - track.scrollLeft);
                  return distance < best.distance ? { index, distance } : best;
                },
                { index: 0, distance: Number.POSITIVE_INFINITY },
              );
              setTestimonialIndex(closest.index);
            }}
          >
            {testimonials.map((testimonial, index) => (
              <figure
                className={`testimonial ${index === 2 ? "testimonial-long" : ""}`}
                key={testimonial.name}
                aria-label={`Client note ${index + 1} of ${testimonials.length}`}
              >
                <span className="testimonial-index">
                  {String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                </span>
                <blockquote>
                  {testimonial.quote.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </blockquote>
                <figcaption>
                  {testimonial.name} <span>· Client</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="testimonial-controls">
            <div className="testimonial-dots" aria-label="Choose a client note">
              {testimonials.map((testimonial, index) => (
                <button
                  type="button"
                  key={testimonial.name}
                  className={index === testimonialIndex ? "is-current" : undefined}
                  onClick={() => showTestimonial(index)}
                  aria-label={`Show note ${index + 1} from ${testimonial.name}`}
                  aria-current={index === testimonialIndex ? "true" : undefined}
                />
              ))}
            </div>
            <div className="testimonial-arrows">
              <button type="button" onClick={() => changeTestimonial(-1)} aria-label="Previous client note">
                <ArrowLeft size={20} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => changeTestimonial(1)} aria-label="Next client note">
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
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
