"use client";

import { useEffect, type RefObject } from "react";
import { streamManifestUrl } from "@/lib/stream";

export function useStreamVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  videoId: string,
  customerCode: string,
  fallbackSrc: string | undefined,
  active: boolean,
  onFatalError?: () => void,
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !active) return;

    const manifest = streamManifestUrl({ videoId, customerCode });
    let disposed = false;
    let stream: import("hls.js").default | undefined;
    const fallback = () => {
      if (disposed) return;
      stream?.destroy();
      stream = undefined;
      if (!fallbackSrc) {
        onFatalError?.();
        return;
      }
      video.src = fallbackSrc;
      video.load();
      if (video.autoplay) video.play().catch(() => undefined);
    };

    const playNatively = () => {
      if (disposed) return;
      if (!manifest || !video.canPlayType("application/vnd.apple.mpegurl")) {
        fallback();
        return;
      }
      video.src = manifest;
      video.load();
      if (video.autoplay) video.play().catch(() => undefined);
    };

    if (!manifest) {
      fallback();
    } else {
      import("hls.js")
        .then(({ default: Hls }) => {
          if (disposed) return;
          if (!Hls.isSupported()) {
            playNatively();
            return;
          }
          stream = new Hls({ maxBufferLength: 30 });
          stream.on(Hls.Events.MANIFEST_PARSED, () => {
            if (video.autoplay) video.play().catch(() => undefined);
          });
          stream.on(Hls.Events.ERROR, (_, error) => {
            if (error.fatal) fallback();
          });
          stream.loadSource(manifest);
          stream.attachMedia(video);
        })
        .catch(playNatively);
    }

    return () => {
      disposed = true;
      stream?.destroy();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [videoRef, videoId, customerCode, fallbackSrc, active, onFatalError]);
}
