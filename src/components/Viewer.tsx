"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Photo } from "./Media";
import { site, streamPlayerUrl, type Story, type Film, type Reel } from "@/data/site";

export function Viewer({
  story,
  film,
  reel,
  close,
}: {
  story?: Story;
  film?: Film;
  reel?: Reel;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const reduced = useReducedMotion();
  const count = story?.gallery.length ?? 0;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current;
    element?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="viewer"
      aria-labelledby="viewer-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      onKeyDown={(event) => {
        if (count && event.key === "ArrowRight")
          setIndex((value) => (value + 1) % count);
        if (count && event.key === "ArrowLeft")
          setIndex((value) => (value - 1 + count) % count);
      }}
    >
      <div className="viewer-inner">
        <div className="viewer-top">
          <h2 id="viewer-title">{story?.title ?? film?.title ?? reel?.title}</h2>
          <button
            className="icon-button"
            autoFocus
            onClick={close}
            aria-label="Close viewer"
          >
            <X />
          </button>
        </div>
        {story && (
          <>
            <div className="viewer-photo">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  className="viewer-photo-layer"
                  initial={{ opacity: reduced ? 1 : 0.5 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: reduced ? 1 : 0.5 }}
                  transition={{ duration: 0.16 }}
                >
                  <Photo
                    frame={story.gallery[index]}
                    sizes="(max-width: 700px) 100vw, 85vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="viewer-bottom">
              <p>{story.subtitle}</p>
              <div className="viewer-pagination">
                <button
                  className="icon-button"
                  onClick={() => setIndex((index - 1 + count) % count)}
                  aria-label="Previous photograph"
                >
                  <ArrowLeft />
                </button>
                <span aria-live="polite">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(count).padStart(2, "0")}
                </span>
                <button
                  className="icon-button"
                  onClick={() => setIndex((index + 1) % count)}
                  aria-label="Next photograph"
                >
                  <ArrowRight />
                </button>
              </div>
            </div>
            <p className="viewer-description">{story.description}</p>
          </>
        )}
        {film &&
          (videoError ? (
            <div className="video-error">
              <p>This film couldn’t load.</p>
              <a href={site.facebook} target="_blank" rel="noopener noreferrer">
                Find XRISH on Facebook <ArrowUpRight size={18} />
              </a>
            </div>
          ) : streamPlayerUrl(film) ? (
            <>
              <div className="stream-player">
                <iframe
                  src={streamPlayerUrl(film)}
                  title={`${film.title} — video player`}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  onError={() => setVideoError(true)}
                />
              </div>
              <p className="stream-help">
                Having trouble playing?{" "}
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Find XRISH on Facebook
                </a>
                .
              </p>
            </>
          ) : (
            <p className="video-error">This film is coming soon.</p>
          ))}
        {reel && (
          <>
            <div className="reel-player">
              <iframe
                title={`${reel.title} — Facebook video player`}
                src={`https://www.facebook.com/plugins/video.php?height=314&href=${encodeURIComponent(`${reel.url}/`)}&show_text=false&width=560&t=0`}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <p className="stream-help">
              If this reel cannot play here, <a href={reel.url} target="_blank" rel="noopener noreferrer">watch it on Facebook <ArrowUpRight size={14} aria-hidden="true" /></a>.
            </p>
          </>
        )}
      </div>
    </dialog>
  );
}
