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
  Reorder,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "motion/react";
import {
  stories,
  contactSheet,
  eventTypes,
  heroPortrait,
  debutFilms,
  previewFilms,
  testimonials,
  site,
  streamCustomerCode,
  type Story,
} from "@/data/site";
import { Photo } from "./Media";
import { Viewer } from "./Viewer";
import { LatestFacebookFilm } from "./LatestFacebookFilm";
import { CinematicFilm } from "./CinematicFilm";
import { FaqList } from "./FaqList";
import { faqs } from "@/data/faq";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRotatingHeroFilm } from "@/hooks/useRotatingHeroFilm";
import { useStreamVideo } from "@/hooks/useStreamVideo";
import { claimVideoSound, VIDEO_SOUND_EVENT } from "@/lib/video-coordination";
import { hostedImageUrl } from "@/lib/cloudflare-images";
import { ImageReveal, RevealHeading } from "./EditorialMotion";
import { RollingLabel } from "./RollingLabel";

type SelectedStory = { story: Story; source?: { left: number; top: number; width: number; height: number }; initialIndex: number };

export function Portfolio() {
  const [selected, setSelected] = useState<SelectedStory>();
  const [storyOrder, setStoryOrder] = useState(() => stories.slice(1).map((story) => story.slug));
  const [canReorder, setCanReorder] = useState(false);
  const lastStoryDragEnd = useRef(0);
  const storyDragging = useRef(false);
  const [leadPhotoIndex, setLeadPhotoIndex] = useState(0);
  const [leadPaused, setLeadPaused] = useState(false);
  const [leadHovered, setLeadHovered] = useState(false);
  const [leadFocused, setLeadFocused] = useState(false);
  const [heroMuted, setHeroMuted] = useState(true);
  const [heroPaused, setHeroPaused] = useState(false);
  const [heroEntered, setHeroEntered] = useState(false);
  const [activeCoverage, setActiveCoverage] = useState(0);
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
  const coverageRoot = useRef<HTMLElement>(null);
  const heroManuallyPaused = useRef(false);
  const reduced = useHydratedReducedMotion();
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRoot, offset: ["start start", "end start"] });
  const heroCopyY = useTransform(heroScroll, [0, 1], [0, -22]);
  const { scrollYProgress: coverageScroll } = useScroll({ target: coverageRoot, offset: ["start end", "end start"] });
  useMotionValueEvent(coverageScroll, "change", (value) => {
    const next = Math.min(eventTypes.length - 1, Math.max(0, Math.floor(value * eventTypes.length)));
    setActiveCoverage((current) => current === next ? current : next);
  });
  useEffect(() => {
    const enter = () => setHeroEntered(true);
    window.addEventListener("xrish:intro-complete", enter);
    const fallback = window.setTimeout(enter, 2400);
    return () => { window.removeEventListener("xrish:intro-complete", enter); window.clearTimeout(fallback); };
  }, []);
  const heroFilm = useRotatingHeroFilm();
  useStreamVideo(heroVideo, heroFilm.streamVideoId, streamCustomerCode, heroFilm.src, true);
  const heroAppearsPaused = reduced || heroPaused;
  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 701px)");
    const update = () => setCanReorder(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const arrangedStories = storyOrder.map((slug) => stories.find((story) => story.slug === slug)).filter((story): story is Story => Boolean(story));
  const moveStory = (slug: string, direction: number) => {
    setStoryOrder((current) => {
      const from = current.indexOf(slug);
      const to = Math.max(0, Math.min(current.length - 1, from + direction));
      if (from === to) return current;
      const next = [...current];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  };
  const openStory = (story: Story, source: HTMLElement | null, frameSrc = story.cover.image.src) => {
    const rect = source?.getBoundingClientRect();
    setSelected({
      story,
      source: rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : undefined,
      initialIndex: Math.max(0, story.gallery.findIndex((frame) => frame.image.src === frameSrc)),
    });
  };
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
    let inView = true;
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      const video = heroVideo.current;
      if (!video || reduced) return;
      if (!entry.isIntersecting) video.pause();
      else if (!document.hidden && !heroManuallyPaused.current) video.play().catch(() => undefined);
    }, { threshold: 0.05 });
    const visibility = () => {
      const video = heroVideo.current;
      if (!video || reduced) return;
      if (document.hidden) video.pause();
      else if (inView && !heroManuallyPaused.current) video.play().catch(() => undefined);
    };
    observer.observe(root);
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
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
        <motion.div className="hero-copy" style={reduced ? undefined : { y: heroCopyY }}>
          <h1 id="hero-heading">
            <span className="editorial-mask">
            <motion.span
              initial={reduced ? false : { y: "105%" }}
              animate={heroEntered ? { y: 0 } : { y: "105%" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              XRISH
            </motion.span>
            </span>
            <span className="editorial-mask">
            <motion.span
              initial={reduced ? false : { y: "105%" }}
              animate={heroEntered ? { y: 0 } : { y: "105%" }}
              transition={{ duration: 0.85, delay: .1, ease: [0.16, 1, 0.3, 1] }}
            >
              CREATIVES
            </motion.span>
            </span>
          </h1>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={heroEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: .7, delay: .23, ease: [0.16, 1, 0.3, 1] }}
          >
            Photo and film for the days
            <br />that gather everyone you love.
          </motion.p>
          <motion.div className="hero-action" initial={reduced ? false : { opacity: 0, y: 12 }} animate={heroEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ duration: .65, delay: .37, ease: [0.16, 1, 0.3, 1] }}>
            <Link href="/works" className="text-link"><RollingLabel>Explore our work</RollingLabel> <ArrowDown size={18} aria-hidden="true" /></Link>
          </motion.div>
        </motion.div>
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
          <RevealHeading id="work-heading" lines={[<>Selected stories<span className="heading-period">.</span></>]} />
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
            data-cursor="VIEW"
            onClick={(event) => openStory(stories[0], event.currentTarget, leadPhoto.image.src)}
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
              onClick={(event) => openStory(stories[0], event.currentTarget.closest(".lead-story")?.querySelector(".story-image") as HTMLElement | null, leadPhoto.image.src)}
              aria-label={`Open ${stories[0].title}`}
            >
              <ArrowUpRight />
            </button>
          </div>
        </article>
        <Reorder.Group as="div" role="group" values={storyOrder} onReorder={setStoryOrder} className="story-spread page-pad" aria-label="Selected stories. On desktop, drag or use left and right arrow keys to rearrange.">
          {arrangedStories.map((story, index) => (
            <Reorder.Item
              as="article"
              key={story.slug}
              value={story.slug}
              className={`story story-${index}`}
              dragListener={canReorder && !reduced}
              whileDrag={{ scale: 1.012, zIndex: 5 }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              tabIndex={canReorder ? 0 : -1}
              aria-label={canReorder ? `${story.title}. Use left or right arrow keys to change its position.` : story.title}
              onKeyDown={(event) => {
                if (!canReorder) return;
                if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                  event.preventDefault();
                  moveStory(story.slug, event.key === "ArrowLeft" ? -1 : 1);
                }
              }}
              onDragStart={() => { storyDragging.current = true; }}
              onDragEnd={() => { lastStoryDragEnd.current = performance.now(); storyDragging.current = false; }}
            >
              <button
                className="story-image"
                data-cursor="VIEW"
                onClick={(event) => {
                  if (storyDragging.current || performance.now() - lastStoryDragEnd.current <= 250) return;
                  const alternate = event.currentTarget.querySelector<HTMLElement>(".story-alternate-photo");
                  const alternateVisible = alternate && Number.parseFloat(getComputedStyle(alternate).opacity) > 0.5;
                  openStory(story, event.currentTarget, alternateVisible ? story.gallery[4].image.src : story.cover.image.src);
                }}
                aria-label={`View ${story.title}`}
              >
                <ImageReveal><Photo
                  frame={story.cover}
                  sizes="(max-width: 700px) 100vw, 50vw"
                />{story.slug === "cherrielle-in-color" && (
                  <span className="story-alternate-photo" aria-hidden="true">
                    <Photo frame={{ ...story.gallery[4], alt: "" }} sizes="(max-width: 700px) 100vw, 50vw" />
                  </span>
                )}</ImageReveal>
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
                  onClick={(event) => { if (!storyDragging.current && performance.now() - lastStoryDragEnd.current > 250) openStory(story, event.currentTarget.closest(".story")?.querySelector(".story-image") as HTMLElement | null); }}
                  aria-label={`Open ${story.title}`}
                >
                  <ArrowUpRight />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </section>

      <section
        id="films"
        className="films-section"
        aria-labelledby="films-heading"
      >
        <div className="film-top page-pad">
          <RevealHeading id="films-heading" lines={["The moments", "still move."]} />
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
              <h3 id="film-story-heading">Good frames come from having fun.</h3>
              <p>
                Between takes, we played around, laughed with the debutant, and
                let the shoot feel easy. Nothing too serious or strict, just a
                good time together, with room for the real moments to find
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
        <div className="film-feature film-feature-sde page-pad">
          <CinematicFilm film={debutFilms[0]} />
        </div>
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
          data-cursor="DRAG"
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
        ref={coverageRoot}
        aria-labelledby="coverage-heading"
      >
        <div className="coverage-intro">
          <RevealHeading id="coverage-heading" lines={["Whatever", "you’re celebrating."]} />
          <p>
            Big milestones. Small gatherings.
            <br />
            Your people, together.
          </p>
          <a
            href={site.messenger}
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
            <ImageReveal><Photo frame={heroPortrait} sizes="(max-width: 700px) 90vw, 40vw" /></ImageReveal>
            <span>
              Explore the films <ArrowUpRight size={18} aria-hidden="true" />
            </span>
          </Link>
        </div>
        <div className="event-list">
          {eventTypes.map((type, index) => {
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
              data-active={index === activeCoverage}
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
            <RevealHeading id="testimonials-heading" lines={["Kind words.", "Kept close."]} />
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
          <RevealHeading id="about-heading" lines={["Small team.", "Big days."]} />
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
          <Link className="text-link" href="/about">
            <RollingLabel>Meet the team</RollingLabel> <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="about-image">
          <ImageReveal><Photo
            frame={{ ...contactSheet[5], position: "50% 35%" }}
            sizes="100vw"
          /></ImageReveal>
          <span>THE WAY WE SEE IT.</span>
        </div>
      </section>

      <section className="faq-preview page-pad" aria-labelledby="faq-preview-title">
        <div className="faq-preview-heading">
          <div>
            <span className="faq-eyebrow">GOOD TO KNOW</span>
            <RevealHeading id="faq-preview-title" lines={["Before the day begins."]} />
          </div>
          <p>From your first message to the finished photographs and films.</p>
        </div>
        <FaqList items={faqs.slice(0, 3)} />
        <Link href="/faq" className="text-link faq-more">
          <RollingLabel>See all FAQs</RollingLabel> <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </section>

      <section
        id="contact"
        className="contact-section page-pad"
        aria-labelledby="contact-heading"
      >
        <div className="contact-top">
          <p>
            <a href={site.messenger} target="_blank" rel="noopener noreferrer">
              Tell us what you’re planning.
            </a>
            <br />
            We’ll take it from there.
          </p>
        </div>
        <RevealHeading id="contact-heading" lines={["LET’S MAKE", "IT A MEMORY."]} />
        <a
          className="contact-action"
          href={site.messenger}
          target="_blank"
          rel="noopener noreferrer"
        >
          <RollingLabel>Message Us</RollingLabel> <ArrowUpRight aria-hidden="true" />
        </a>
        <div className="contact-note">
          <span>Debut. Predebut. Weddings. Corporate Events. Graduations.</span>
          <a href={site.messenger} target="_blank" rel="noopener noreferrer">
            Let’s talk on Messenger.
          </a>
        </div>
      </section>
      {selected && (
        <Viewer
          key={selected.story.slug}
          story={selected.story}
          source={selected.source}
          initialIndex={selected.initialIndex}
          close={() => setSelected(undefined)}
        />
      )}
    </>
  );
}
