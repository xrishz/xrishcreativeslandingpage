"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

const INTRO_KEY = "xrish-intro-seen";

export function IntroLoader() {
  const prefersReducedMotion = useHydratedReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const seen = window.sessionStorage.getItem(INTRO_KEY);
    if (!seen) window.sessionStorage.setItem(INTRO_KEY, "true");
    const timer = window.setTimeout(
      () => setVisible(false),
      seen ? 0 : prefersReducedMotion ? 350 : 1650,
    );
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="intro-loader"
          role="status"
          aria-label="XRISH CREATIVES is loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.55 }}
        >
          <div className="intro-loader-mark" aria-hidden="true">
            <strong>XRISH</strong>
            <span>CREATIVES</span>
          </div>
          <motion.div
            className="intro-loader-line"
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 1.25,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
