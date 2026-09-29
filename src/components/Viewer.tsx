"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Photo } from "./Media";
import { site, streamPlayerUrl, type Story, type Film } from "@/data/site";

export function Viewer({
  story,
  film,
  source,
  initialIndex = 0,
  close,
}: {
  story?: Story;
  film?: Film;
  source?: { left: number; top: number; width: number; height: number };
  initialIndex?: number;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const photoBox = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(initialIndex);
  const [flightTarget, setFlightTarget] = useState<typeof source>();
  const [arriving, setArriving] = useState(Boolean(source && !reduced));
  const [returning, setReturning] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const count = story?.gallery.length ?? 0;
  useLayoutEffect(() => {
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
  useLayoutEffect(() => {
    if (source && story && !reduced && photoBox.current) {
      const box = photoBox.current.getBoundingClientRect();
      const frame = story.gallery[initialIndex] ?? story.gallery[0];
      const ratio = Math.min(box.width / frame.image.width, box.height / frame.image.height);
      const width = frame.image.width * ratio;
      const height = frame.image.height * ratio;
      setFlightTarget({
        left: box.left + (box.width - width) / 2,
        top: box.top + (box.height - height) / 2,
        width,
        height,
      });
    }
  }, [source, story, initialIndex, reduced]);
  const requestClose = () => {
    if (returning) return;
    if (source && flightTarget && !reduced && story && index === initialIndex && !arriving) setReturning(true);
    else close();
  };
  return (
    <dialog
      ref={dialog}
      className="viewer"
      aria-labelledby="viewer-title"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
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
            onClick={requestClose}
            aria-label="Close viewer"
          >
            <X />
          </button>
        </div>
        {story && (
          <>
            <div className="viewer-photo" ref={photoBox}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  className="viewer-photo-layer"
                  initial={{ opacity: reduced || !source ? 1 : 0 }}
                  animate={{ opacity: arriving || returning ? 0 : 1 }}
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
            {source && flightTarget && (arriving || returning) && (
              <motion.div
                key={returning ? "return" : "arrive"}
                className="viewer-flight"
                initial={returning ? flightTarget : source}
                animate={returning ? source : flightTarget}
                transition={{ duration: returning ? 0.42 : 0.56, ease: [0.16, 1, 0.3, 1] }}
                onAnimationComplete={() => returning ? close() : setArriving(false)}
              >
                <Photo frame={story.gallery[initialIndex]} sizes="85vw" priority />
              </motion.div>
            )}
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
                  title={`${film.title} video player`}
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
      </div>
    </dialog>
  );
}
