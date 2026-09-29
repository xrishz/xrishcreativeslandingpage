"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

type CurtainPhase = "idle" | "cover" | "uncover";

const columns = 10;
const rows = 8;
const pageTitles: Record<string, string> = {
  "/": "Home",
  "/works": "Our Works",
  "/about": "About XRISH",
  "/faq": "FAQ",
};
const pixels = Array.from({ length: columns * rows }, (_, index) => {
  const row = Math.floor(index / columns);
  const column = index % columns;
  // A deterministic diagonal wave keeps server and client output identical.
  return { index, delay: Math.round((row * 0.62 + column * 0.38) * 22) };
});

export function MotionSystem({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useHydratedReducedMotion();
  const [phase, setPhase] = useState<CurtainPhase>("idle");
  const [transitionTitle, setTransitionTitle] = useState("");
  const pending = useRef<string | null>(null);
  const origin = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const scheduled = timers.current;
    return () => { scheduled.forEach(window.clearTimeout); };
  }, []);

  useEffect(() => {
    const schedule = (callback: () => void, delay: number) => {
      timers.current.push(window.setTimeout(callback, delay));
    };
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.defaultPrevented || reduced) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin || url.hash || url.pathname === window.location.pathname || !["/", "/works", "/about", "/faq"].includes(url.pathname)) return;
      event.preventDefault();
      if (pending.current) return;
      pending.current = url.pathname;
      origin.current = window.location.pathname;
      setTransitionTitle(pageTitles[url.pathname]);
      setPhase("cover");
      schedule(() => router.push(url.pathname), 470);
      // A failed navigation must never leave an opaque, click-blocking screen.
      schedule(() => {
        if (pending.current) {
          pending.current = null;
          setPhase("idle");
        }
      }, 5500);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router, reduced]);

  useEffect(() => {
    if (pending.current !== pathname) {
      // Browser Back/Forward is native and must not inherit a previous curtain.
      if (!pending.current || (origin.current && pathname !== origin.current)) {
        pending.current = null;
        setPhase("idle");
      }
      return;
    }
    pending.current = null;
    origin.current = null;
    const reveal = window.setTimeout(() => setPhase("uncover"), 40);
    const finish = window.setTimeout(() => {
      setPhase("idle");
      const main = document.getElementById("main");
      if (main) {
        main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
        main.addEventListener("blur", () => main.removeAttribute("tabindex"), { once: true });
      }
    }, 650);
    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(finish);
    };
  }, [pathname]);

  return (
    <>
      {children}
      <div className="pixel-curtain" data-phase={phase} aria-hidden="true">
        {pixels.map(({ index, delay }) => (
          <span key={index} className="pixel-curtain-cell" style={{ "--pixel-delay": `${delay}ms` } as React.CSSProperties} />
        ))}
        <span className="pixel-curtain-mark">{transitionTitle}</span>
      </div>
    </>
  );
}
