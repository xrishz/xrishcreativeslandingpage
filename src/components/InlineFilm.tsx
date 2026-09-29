"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, RotateCcw } from "lucide-react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { hostedImageUrl } from "@/lib/cloudflare-images";

export function InlineFilm({
  src,
  title,
  poster,
  preview,
  priority = false,
  posterOrigin,
}: {
  src: string;
  title: string;
  poster: string;
  preview: string;
  priority?: boolean;
  posterOrigin: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const previewVideo = useRef<HTMLVideoElement>(null);
  const reduced = useHydratedReducedMotion();
  const [previewReady, setPreviewReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const posterUrl = hostedImageUrl(poster, 1600) ?? poster;

  useEffect(() => {
    const element = stage.current;
    if (!element || started) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPreviewReady(true);
          if (!reduced) previewVideo.current?.play().catch(() => undefined);
        } else {
          previewVideo.current?.pause();
        }
      },
      { rootMargin: "240px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [started, reduced]);

  useEffect(() => {
    if (started || reduced) previewVideo.current?.pause();
  }, [started, reduced]);

  useEffect(() => {
    if (!started || loaded) return;
    const timer = window.setTimeout(() => setFailed(true), 20000);
    return () => window.clearTimeout(timer);
  }, [started, loaded, attempt]);

  const playerUrl = new URL(src);
  if (playerUrl.hostname.endsWith(".cloudflarestream.com")) {
    playerUrl.searchParams.set("poster", new URL(posterUrl, posterOrigin).href);
    playerUrl.searchParams.set("autoplay", "true");
    playerUrl.searchParams.set("primaryColor", "#f5f4f0");
  }

  const retry = () => {
    setLoaded(false);
    setFailed(false);
    setAttempt((current) => current + 1);
  };

  return (
    <figure className="works-film">
      <div ref={stage} className="works-film-stage" data-loaded={loaded}>
        <Image
          src={posterUrl}
          alt=""
          fill
          unoptimized
          priority={priority}
          sizes="(max-width: 700px) 90vw, 50vw"
          className="works-film-poster"
        />
        <video
          ref={previewVideo}
          className="works-film-preview"
          src={previewReady ? preview : undefined}
          poster={posterUrl}
          autoPlay={!reduced}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        />
        {!started && (
          <button
            type="button"
            className="works-film-launch"
            onClick={() => setStarted(true)}
            aria-label={`Play ${title}`}
          >
            <span className="works-film-play">
              <Play size={23} fill="currentColor" aria-hidden="true" />
              <span>Play film</span>
            </span>
          </button>
        )}
        {started && (
          <iframe
            key={attempt}
            src={playerUrl.href}
            title={`${title} video player`}
            loading="eager"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => {
              setLoaded(true);
              setFailed(false);
            }}
          />
        )}
        {started && !loaded && !failed && (
          <div className="works-film-status" role="status">
            Loading film…
          </div>
        )}
        {failed && (
          <div className="works-film-status works-film-error" role="alert">
            <span>The player took too long to load.</span>
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
