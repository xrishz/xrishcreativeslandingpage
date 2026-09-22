"use client";

import { useEffect, useState } from "react";
import { Play, RotateCcw } from "lucide-react";

export function InlineFilm({
  src,
  title,
  index,
  provider,
}: {
  src: string;
  title: string;
  index: number;
  provider: "Facebook";
}) {
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!active || loaded) return;
    const timer = window.setTimeout(() => setFailed(true), 15000);
    return () => window.clearTimeout(timer);
  }, [active, loaded, attempt]);

  const retry = () => {
    setLoaded(false);
    setFailed(false);
    setAttempt((current) => current + 1);
  };

  return (
    <figure className="works-film">
      <div className="works-film-stage" data-active={active}>
        {!active ? (
          <button
            type="button"
            className="works-film-launch"
            onClick={() => setActive(true)}
            aria-label={"Play " + title + " on this page"}
          >
            <span className="works-film-provider">{provider} player</span>
            <strong>{title}</strong>
            <span className="works-film-play">
              <Play size={24} fill="currentColor" aria-hidden="true" />
              Play film
            </span>
          </button>
        ) : (
          <>
            <iframe
              key={attempt}
              src={src}
              title={title + " — " + provider + " video player"}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => {
                setLoaded(true);
                setFailed(false);
              }}
            />
            {!loaded && !failed && (
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
          </>
        )}
      </div>
      <figcaption>
        <span>{String(index).padStart(2, "0")}</span>
        <span>{title}</span>
      </figcaption>
    </figure>
  );
}
