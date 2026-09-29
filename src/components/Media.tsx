"use client";
import Image from "next/image";
import { useState } from "react";
import type { Frame } from "@/data/site";
import { hostedImageUrl } from "@/lib/cloudflare-images";

export function Photo({
  frame,
  sizes = "100vw",
  priority = false,
  className = "",
}: {
  frame: Frame;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [useLocal, setUseLocal] = useState(false);
  const hosted = hostedImageUrl(frame.image.src, 1200);
  if (failed)
    return (
      <div
        className={`photo-fallback ${className}`}
        role="img"
        aria-label={frame.alt}
      >
        <span>Photograph unavailable</span>
        <small>Please refresh to try again.</small>
      </div>
    );
  return (
    <Image
      key={useLocal ? "local" : "cloudflare"}
      className={className}
      src={frame.image.src}
      loader={hosted && !useLocal ? ({ src, width }) => hostedImageUrl(src, width) ?? src : undefined}
      alt={frame.alt}
      fill
      sizes={sizes}
      quality={90}
      preload={priority}
      placeholder="blur"
      blurDataURL={frame.image.blurDataURL}
      style={{
        objectFit: "cover",
        objectPosition: frame.position ?? "50% 50%",
      }}
      onError={() => {
        if (hosted && !useLocal) setUseLocal(true);
        else setFailed(true);
      }}
    />
  );
}
