"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";
import { streamCustomerCode, type PreviewFilm } from "@/data/site";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useStreamVideo } from "@/hooks/useStreamVideo";
import { useVideoPlayback } from "@/hooks/useVideoPlayback";
import { claimVideoPlayback, claimVideoSound, releaseVideoPlayback, VIDEO_SOUND_EVENT } from "@/lib/video-coordination";
import { hostedImageUrl } from "@/lib/cloudflare-images";

type CinematicFilmProps = {
  film: PreviewFilm;
  priority?: boolean;
  posterPriority?: boolean;
};

const subscribeHydration = () => () => undefined;
const clientIsHydrated = () => true;
const serverIsHydrated = () => false;

export function CinematicFilm({
  film,
  priority = false,
  posterPriority = false,
}: CinematicFilmProps) {
  const video = useRef<HTMLVideoElement>(null);
  const root = useRef<HTMLElement>(null);
  const reduced = useHydratedReducedMotion();
  const hydrated = useSyncExternalStore(subscribeHydration, clientIsHydrated, serverIsHydrated);
  const [ready, setReady] = useState(priority);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [viewing, setViewing] = useState(false);
  const [readyFrame, setReadyFrame] = useState(false);
  const playback = useVideoPlayback();
  const playbackId = `film-${film.slug}`;
  const inactive = playback.active !== null && playback.active !== playbackId;
  const manuallyPaused = useRef(false);
  const pausedByViewport = useRef(false);
  const pausedByDocument = useRef(false);
  const inViewport = useRef(false);
  const userActivated = useRef(false);
  const resumeRequested = useRef(false);
  const posterUrl = hostedImageUrl(film.poster, 1600) ?? film.poster;
  useStreamVideo(video, film.streamVideoId, streamCustomerCode, film.src, ready);

  useEffect(() => () => releaseVideoPlayback(playbackId), [playbackId]);

  useEffect(() => {
    if (!reduced) return;
    video.current?.pause();
  }, [reduced]);

  useEffect(() => {
    if (priority) return;
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setReady(true);
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport.current = entry.isIntersecting;
        const player = video.current;
        if (!player || reduced) return;
        if (!entry.isIntersecting) {
          if (!player.paused) {
            pausedByViewport.current = true;
            player.pause();
          }
          return;
        }
        if (pausedByViewport.current && !document.hidden && !manuallyPaused.current && !inactive) {
          pausedByViewport.current = false;
          player.play().catch(() => undefined);
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduced, inactive]);

  useEffect(() => {
    const visibility = () => {
      const player = video.current;
      if (!player || reduced) return;
      if (document.hidden) {
        pausedByDocument.current = !player.paused;
        if (pausedByDocument.current) player.pause();
      } else if (pausedByDocument.current && inViewport.current && !manuallyPaused.current && !inactive) {
        pausedByDocument.current = false;
        player.play().catch(() => undefined);
      }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, [reduced, inactive]);

  useEffect(() => {
    if (!inactive) return;
    const element = video.current;
    if (!element) return;
    element.pause();
    element.muted = true;
    setMuted(true);
  }, [inactive]);

  useEffect(() => {
    if (inactive || !resumeRequested.current) return;
    resumeRequested.current = false;
    const element = video.current;
    if (!element) return;
    element.muted = false;
    setMuted(false);
    manuallyPaused.current = false;
    claimVideoSound(`film-${film.slug}`);
    userActivated.current = true;
    element.play().catch(() => setPaused(true));
  }, [inactive, film.slug]);

  useEffect(() => {
    const muteWhenAnotherFilmSpeaks = (event: Event) => {
      const source = (event as CustomEvent<{ source?: string }>).detail?.source;
      if (source === `film-${film.slug}`) return;
      const element = video.current;
      if (!element) return;
      element.muted = true;
      setMuted(true);
    };
    window.addEventListener(VIDEO_SOUND_EVENT, muteWhenAnotherFilmSpeaks);
    return () => window.removeEventListener(VIDEO_SOUND_EVENT, muteWhenAnotherFilmSpeaks);
  }, [film.slug]);

  useEffect(() => {
    const element = video.current;
    if (!element || !ready || reduced || inactive || manuallyPaused.current || viewing) return;
    element.play().then(() => setPaused(false)).catch(() => setPaused(true));
  }, [ready, reduced, inactive, viewing]);

  const togglePlayback = () => {
    const element = video.current;
    if (!element) return;
    if (element.paused) {
      manuallyPaused.current = false;
      userActivated.current = true;
      claimVideoPlayback(playbackId);
      element.play().then(() => setPaused(false)).catch(() => setPaused(true));
    } else {
      manuallyPaused.current = true;
      element.pause();
      setPaused(true);
    }
  };

  const startFilm = () => {
    const element = video.current;
    if (!element) return;
    element.currentTime = 0;
    element.muted = false;
    manuallyPaused.current = false;
    userActivated.current = true;
    setMuted(false);
    setViewing(true);
    claimVideoPlayback(playbackId);
    element.play().then(() => setPaused(false)).catch(() => setPaused(true));
  };

  const resumeFilm = () => {
    resumeRequested.current = true;
    claimVideoPlayback(playbackId);
  };

  return (
    <motion.article
      ref={root}
      className={`cinematic-film cinematic-film-${film.slug}`}
      initial={reduced ? false : { y: 48 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="cinematic-stage" data-cursor="WATCH" data-ready-frame={readyFrame} data-inactive={inactive}>
        <Image
          src={posterUrl}
          alt=""
          fill
          unoptimized
          priority={priority || posterPriority}
          sizes="(max-width: 700px) 90vw, 50vw"
          className="cinematic-poster"
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          onContextMenu={(event) => event.preventDefault()}
        />
        <video
          ref={video}
          data-film-src={film.src}
          data-stream-id={film.streamVideoId}
          poster={posterUrl}
          autoPlay={!reduced && !inactive}
          muted={muted}
          loop
          playsInline
          preload={priority ? "auto" : "metadata"}
          controls={viewing && !inactive}
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          draggable={false}
          aria-label={`${film.title}: ${film.category}`}
          onContextMenu={(event) => event.preventDefault()}
          onLoadedData={() => {
            setReadyFrame(true);
            if (viewing && !inactive && !manuallyPaused.current) video.current?.play().then(() => setPaused(false)).catch(() => setPaused(true));
          }}
          onPlaying={() => {
            setReadyFrame(true);
            if (inactive) video.current?.pause();
          }}
          onPlay={() => {
            if (inactive) {
              video.current?.pause();
              return;
            }
            setPaused(false);
            if (viewing || userActivated.current) claimVideoPlayback(playbackId);
          }}
          onPause={() => {
            setPaused(true);
            if (viewing || userActivated.current) releaseVideoPlayback(playbackId);
            userActivated.current = false;
          }}
          onVolumeChange={(event) => {
            const element = event.currentTarget;
            setMuted(element.muted);
            if (!element.muted) claimVideoSound(`film-${film.slug}`);
          }}
        />
        <div className="cinematic-scrim" aria-hidden="true" />
        {hydrated && inactive && viewing && (
          <button className="cinematic-resume" type="button" onClick={resumeFilm} aria-label={`Continue ${film.title} from where you left off`}>
            <Play size={16} fill="currentColor" aria-hidden="true" /> Continue film
          </button>
        )}
        {hydrated && !viewing && <div className="cinematic-controls">
          <button
            type="button"
            onClick={() => {
              if (muted) startFilm();
              else {
                const element = video.current;
                if (!element) return;
                element.muted = true;
                setMuted(true);
              }
            }}
            aria-label={muted ? `Watch ${film.title} from the beginning` : `Mute ${film.title}`}
          >
            {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            {muted ? "Watch the film" : "Sound on"}
          </button>
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={paused ? `Play ${film.title}` : `Pause ${film.title}`}
          >
            {paused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
            {paused ? "Play" : "Pause"}
          </button>
        </div>}
      </div>
      <div className="cinematic-caption">
        <div>
          <h3>{film.title}</h3>
          <p>{film.description}</p>
        </div>
      </div>
    </motion.article>
  );
}
