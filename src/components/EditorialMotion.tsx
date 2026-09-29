"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

const ease = [0.16, 1, 0.3, 1] as const;

export function RevealHeading({
  as = "h2", lines, className, id,
}: {
  as?: "h1" | "h2" | "h3";
  lines: ReactNode[];
  className?: string;
  id?: string;
}) {
  const reduced = useHydratedReducedMotion();
  const Tag = as;
  return (
    <Tag className={className} id={id}>
      {lines.map((line, index) => (
        <motion.span
          className="editorial-mask"
          key={index}
          initial={reduced ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.span
            className="editorial-mask-line"
            variants={{ hidden: { y: "104%" }, visible: { y: "0%" } }}
            transition={{ duration: 0.78, delay: index * 0.09, ease }}
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  );
}

export function ImageReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useHydratedReducedMotion();
  return (
    <motion.div
      className={`image-reveal ${className}`}
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
    >
      <motion.div
        className="image-reveal-inner"
        variants={{ hidden: { clipPath: "inset(0 0 100% 0)", scale: 1.045 }, visible: { clipPath: "inset(0 0 0% 0)", scale: 1 } }}
        transition={{ duration: 0.9, ease }}
      >{children}</motion.div>
    </motion.div>
  );
}

export function FooterReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], [56, 0]);
  return <div ref={root} className="footer-reveal"><motion.div style={reduced ? undefined : { y }}>{children}</motion.div></div>;
}
