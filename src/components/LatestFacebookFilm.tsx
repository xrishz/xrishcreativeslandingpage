"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Play, RotateCcw } from "lucide-react";
import type { LatestFacebookVideo } from "@/lib/facebook";
import { driveFilms, site, streamCustomerCode } from "@/data/site";
import { InlineFilm } from "@/components/InlineFilm";

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
    const timer = window.setTimeout(() => controller.abort(), 33000);
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
        <h3 id="latest-facebook-title">Fresh from the page.</h3>
        <p>Recent work from our Facebook page.</p>
      </div>

      {video ? (
        <article className="latest-facebook-film">
          <div className="latest-facebook-frame">
            {!playerActive ? (
              <button
                type="button"
                className="latest-facebook-launch"
                onClick={() => setPlayerActive(true)}
                aria-label={`Play ${video.title} on this page`}
              >
                {video.previewUrl && (
                  <span
                    className="latest-facebook-preview"
                    style={{ backgroundImage: `url(${JSON.stringify(video.previewUrl)})` }}
                    aria-hidden="true"
                  />
                )}
                <span className="latest-facebook-label">Latest Facebook film</span>
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
        <article className="latest-facebook-film latest-facebook-fallback">
          <div className="latest-facebook-frame">
            <InlineFilm
              streamVideoId={driveFilms.graduation[0].streamVideoId}
              customerCode={streamCustomerCode}
              title={driveFilms.graduation[0].title}
              poster={driveFilms.graduation[0].poster}
              preview={driveFilms.graduation[0].preview}
            />
          </div>
          <div className="latest-facebook-copy">
            <span>Recent work</span>
            <h4>{driveFilms.graduation[0].title}</h4>
            <p>Commencement day in Sto. Tomas, held in motion.</p>
            <a href={site.facebook} target="_blank" rel="noopener noreferrer">
              View the XRISH page <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </article>
      )}
    </section>
  );
}
