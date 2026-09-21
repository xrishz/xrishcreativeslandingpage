"use client";

import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

export function CameraCursor() {
  const x = useMotionValue(-80);
  const y = useMotionValue(-80);
  const trailX = useSpring(x, { stiffness: 520, damping: 42, mass: 0.24 });
  const trailY = useSpring(y, { stiffness: 520, damping: 42, mass: 0.24 });
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateCapability = () => setEnabled(media.matches);
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      setInteractive(
        event.target instanceof Element &&
          Boolean(event.target.closest("a, button, [role='button']")),
      );
    };
    const leave = () => setVisible(false);

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
      className="camera-cursor"
      data-visible={visible}
      data-interactive={interactive}
      aria-hidden="true"
    >
      {!reduced && (
        <motion.span
          className="camera-cursor-trail"
          style={{ x: trailX, y: trailY }}
        />
      )}
      <motion.span className="camera-cursor-mark" style={{ x, y }}>
        <Camera size={17} strokeWidth={1.65} />
      </motion.span>
    </div>
  );
}
