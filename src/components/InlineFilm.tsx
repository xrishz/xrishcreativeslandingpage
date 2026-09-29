"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Play, RotateCcw } from "lucide-react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useStreamVideo } from "@/hooks/useStreamVideo";
import { hostedImageUrl } from "@/lib/cloudflare-images";
import { claimVideoSound, VIDEO_SOUND_EVENT } from "@/lib/video-coordination";

type InlineFilmProps = {
  streamVideoId: string;
  customerCode: string;
  title: string;
  poster: string;
  preview: string;
  priority?: boolean;
};

const subscribeHydration = () => () => undefined;
const clientIsHydrated = () => true;
const serverIsHydrated = () => false;

export function InlineFilm({
  streamVideoId,
  customerCode,
  title,
  poster,
  preview,
  priority = false,
}: InlineFilmProps) {
  const stage = useRef<HTMLDivElement>(null);
  const previewVideo = useRef<HTMLVideoElement>(null);
  const fullVideo = useRef<HTMLVideoElement>(null);
  const reduced = useHydratedReducedMotion();
  const [nearViewport, setNearViewport] = useState(priority);
  const hydrated = useSyncExternalStore(subscribeHydration, clientIsHydrated, serverIsHydrated);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const posterUrl = hostedImageUrl(poster, 1600) ?? poster;
  const onFatalError = useCallback(() => setFailed(true), []);

  // Attach the full Stream source before the visitor presses Play. The short
  // black-and-white preview remains visible while the full film buffers.
  useStreamVideo(
    fullVideo,
    streamVideoId,
    customerCode,
    undefined,
    nearViewport && !failed,
    onFatalError,
  );

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          if (!reduced && !playing) previewVideo.current?.play().catch(() => undefined);
          if (started) fullVideo.current?.play().catch(() => undefined);
        } else {
          previewVideo.current?.pause();
          fullVideo.current?.pause();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduced, started, playing]);

  useEffect(() => {
    if (playing || reduced) previewVideo.current?.pause();
  }, [playing, reduced]);

  useEffect(() => {
    const muteWhenAnotherFilmSpeaks = (event: Event) => {
      const source = (event as CustomEvent<{ source?: string }>).detail?.source;
      if (source === `works-${streamVideoId}`) return;
      if (fullVideo.current) fullVideo.current.muted = true;
    };
    window.addEventListener(VIDEO_SOUND_EVENT, muteWhenAnotherFilmSpeaks);
    return () => window.removeEventListener(VIDEO_SOUND_EVENT, muteWhenAnotherFilmSpeaks);
  }, [streamVideoId]);

  const startFilm = () => {
    const video = fullVideo.current;
    if (!video) return;
    setStarted(true);
    setFailed(false);
    setNearViewport(true);
    video.currentTime = 0;
    video.muted = false;
    claimVideoSound(`works-${streamVideoId}`);
    // The source may still be attaching on a very fast click. loadeddata and
    // autoplay both complete the same first-click intent when it is ready.
    video.play().then(() => setPlaying(true)).catch(() => undefined);
  };

  const retry = () => {
    setFailed(false);
    setPlaying(false);
    setStarted(false);
    setAttempt((current) => current + 1);
  };

  return (
    <figure className="works-film">
      <div ref={stage} className="works-film-stage" data-playing={playing} data-started={started}>
        <Image
          src={posterUrl}
          alt=""
          fill
          unoptimized
          priority={priority}
          sizes="(max-width: 700px) 90vw, 50vw"
          className="works-film-poster"
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          onContextMenu={(event) => event.preventDefault()}
        />
        <video
          ref={previewVideo}
          className="works-film-preview"
          src={nearViewport ? preview : undefined}
          poster={posterUrl}
          autoPlay={!reduced}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        />
        <video
          key={attempt}
          ref={fullVideo}
          className="works-film-player"
          autoPlay={!reduced}
          muted
          playsInline
          preload="auto"
          controls={started && playing}
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          aria-label={`${title} film`}
          onContextMenu={(event) => event.preventDefault()}
          onLoadedData={() => {
            if (started) fullVideo.current?.play().then(() => setPlaying(true)).catch(() => undefined);
          }}
          onCanPlay={() => {
            if (!started) fullVideo.current?.pause();
          }}
          onPlaying={() => {
            if (started) setPlaying(true);
          }}
          onError={() => setFailed(true)}
          onVolumeChange={(event) => {
            if (!event.currentTarget.muted) claimVideoSound(`works-${streamVideoId}`);
          }}
        />
        {hydrated && !started && !failed && (
          <button
            type="button"
            className="works-film-launch"
            onClick={startFilm}
            aria-label={`Play ${title}`}
          >
            <span className="works-film-play">
              <Play size={23} fill="currentColor" aria-hidden="true" />
              <span>Play film</span>
            </span>
          </button>
        )}
        {failed && (
          <div className="works-film-status works-film-error" role="alert">
            <span>The film is unavailable right now.</span>
            <button type="button" onClick={retry}>
              <RotateCcw size={17} aria-hidden="true" /> Try again
            </button>
          </div>
        )}
      </div>
      <figcaption>{title}</figcaption>
    </figure>
  );
}
