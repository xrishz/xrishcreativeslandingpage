"use client";
import Image from "next/image";
import { useState } from "react";
import type { Frame } from "@/data/site";

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
      className={className}
      src={frame.image.src}
      alt={frame.alt}
      fill
      sizes={sizes}
      preload={priority}
      placeholder="blur"
      blurDataURL={frame.image.blurDataURL}
      style={{
        objectFit: "cover",
        objectPosition: frame.position ?? "50% 50%",
      }}
      onError={() => setFailed(true)}
    />
  );
}
