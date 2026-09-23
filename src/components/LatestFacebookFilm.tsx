"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Play, RotateCcw } from "lucide-react";
import type { LatestFacebookVideo } from "@/lib/facebook";
import { site } from "@/data/site";

type LatestResponse = {
  status: "ready" | "empty" | "unconfigured" | "unavailable";
  video: LatestFacebookVideo | null;
};

const facebookPlayer = (url: string) =>
  "https://www.facebook.com/plugins/video.php?height=314&href=" +
  encodeURIComponent(url) +
  "&show_text=false&width=560&t=0";

const formatDate = (value: string | undefined) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return undefined;
  return new Intl.DateTimeFormat("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Manila",
  }).format(date);
};

export function LatestFacebookFilm() {
  const [result, setResult] = useState<LatestResponse>();
  const [playerActive, setPlayerActive] = useState(false);
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [playerFailed, setPlayerFailed] = useState(false);
  const [playerAttempt, setPlayerAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    const timer = window.setTimeout(() => controller.abort(), 8000);
    fetch("/api/facebook/latest-video", { signal: controller.signal })
      .then(async (response) => {
        const body = (await response.json()) as LatestResponse;
        if (!cancelled) setResult(body);
      })
      .catch(() => {
        if (!cancelled) setResult({ status: "unavailable", video: null });
      });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!playerActive || playerLoaded) return;
    const timer = window.setTimeout(() => setPlayerFailed(true), 15000);
    return () => window.clearTimeout(timer);
  }, [playerActive, playerLoaded, playerAttempt]);

  const retryPlayer = () => {
    setPlayerLoaded(false);
    setPlayerFailed(false);
    setPlayerAttempt((current) => current + 1);
  };

  const video = result?.video;
  return (
    <section className="latest-facebook page-pad" aria-labelledby="latest-facebook-title">
      <div className="latest-facebook-intro">
        <h3 id="latest-facebook-title">Latest from XRISH.</h3>
        <p>New films from our Facebook page, as they’re published.</p>
      </div>

      {!result ? (
        <div className="latest-facebook-state" role="status">
          Checking for new work…
        </div>
      ) : video ? (
        <article className="latest-facebook-film">
          <div className="latest-facebook-frame">
            {!playerActive ? (
              <button
                type="button"
                className="latest-facebook-launch"
                onClick={() => setPlayerActive(true)}
                aria-label={`Play ${video.title} on this page`}
              >
                <span>Latest Facebook film</span>
                <strong>{video.title}</strong>
                <span className="latest-facebook-play">
                  <Play size={22} fill="currentColor" aria-hidden="true" />
                  Play film
                </span>
              </button>
            ) : (
              <>
                <iframe
                  key={playerAttempt}
                  title={`${video.title} — latest XRISH Facebook film`}
                  src={facebookPlayer(video.permalinkUrl)}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  onLoad={() => {
                    setPlayerLoaded(true);
                    setPlayerFailed(false);
                  }}
                />
                {!playerLoaded && !playerFailed && (
                  <div className="latest-facebook-player-state" role="status">
                    Loading film…
                  </div>
                )}
                {playerFailed && (
                  <div
                    className="latest-facebook-player-state latest-facebook-player-error"
                    role="alert"
                  >
                    <span>The player took too long to load.</span>
                    <button type="button" onClick={retryPlayer}>
                      <RotateCcw size={16} aria-hidden="true" /> Try again
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="latest-facebook-copy">
            <span>{formatDate(video.createdTime) ?? "Latest film"}</span>
            <h4>{video.title}</h4>
            {video.excerpt && <p>{video.excerpt}</p>}
            <a href={video.permalinkUrl} target="_blank" rel="noopener noreferrer">
              View post on Facebook <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </article>
      ) : (
        <div className="latest-facebook-state">
          <p>Our newest work is on Facebook.</p>
          <a href={site.facebook} target="_blank" rel="noopener noreferrer">
            Visit XRISH CREATIVES <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      )}
    </section>
  );
}
