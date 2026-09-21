"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Photo } from "./Media";
import { site, type Story, type Film } from "@/data/site";

export function Viewer({
  story,
  film,
  close,
}: {
  story?: Story;
  film?: Film;
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
          <h2 id="viewer-title">{story?.title ?? film?.title}</h2>
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
          ) : (
            <video
              className="film-player"
              controls
              playsInline
              preload="metadata"
              poster={film.poster.image.src}
              onError={() => setVideoError(true)}
            >
              <source src={film.src} type="video/mp4" />
              {film.captions && (
                <track
                  kind="captions"
                  src={film.captions}
                  srcLang="en"
                  label="English"
                  default
                />
              )}
              Your browser doesn’t support this film. Please visit our Facebook
              page.
            </video>
          ))}
      </div>
    </dialog>
  );
}
