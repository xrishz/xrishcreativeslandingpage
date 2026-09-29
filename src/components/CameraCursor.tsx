"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { motion, useMotionValue } from "motion/react";

export function CameraCursor() {
  const x = useMotionValue(-80);
  const y = useMotionValue(-80);
  const [enabled, setEnabled] = useState(false);
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateCapability = () => {
      setEnabled(media.matches);
      if (!media.matches && cursor.current) cursor.current.dataset.visible = "false";
    };
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const element = cursor.current;
      if (!element) return;
      element.dataset.visible = "true";
      element.dataset.interactive = String(
        event.target instanceof Element &&
          Boolean(
            event.target.closest(
              "a, button, [role='button'], video[controls], input, select, textarea, summary",
            ),
          ),
      );
      const target = event.target instanceof Element ? event.target : null;
      const context = target?.closest("[data-cursor]")?.getAttribute("data-cursor")
        ?? (target?.closest("a[target='_blank']") ? "↗" : "");
      element.dataset.context = context;
    };
    const leave = () => {
      if (cursor.current) cursor.current.dataset.visible = "false";
    };

    updateCapability();
    media.addEventListener("change", updateCapability);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    window.addEventListener("blur", leave);
    return () => {
      media.removeEventListener("change", updateCapability);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div
      ref={cursor}
      className="camera-cursor"
      data-visible="false"
      data-interactive="false"
      aria-hidden="true"
    >
      <motion.span className="camera-cursor-mark" style={{ x, y }}>
        <Camera size={17} strokeWidth={1.65} />
        <span className="camera-cursor-label" />
      </motion.span>
    </div>
  );
}
