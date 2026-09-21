"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { site } from "@/data/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <a href="#top" className="wordmark" aria-label="XRISH CREATIVES home">
        XRISH<span>CREATIVES</span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#work">Work</a>
        <a href="#films">Films</a>
        <a href="#about">About</a>
      </nav>
      <a
        href={site.facebook}
        className="message-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        Message Us <ArrowUpRight size={17} aria-hidden="true" />
      </a>
      <button
        ref={button}
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close navigation" : "Open navigation"}
      >
        {open ? <X /> : <Menu />}
      </button>
      {open && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {[
            ["Work", "#work"],
            ["Films", "#films"],
            ["About", "#about"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a key={label} href={href} onClick={() => setOpen(false)}>
              {label}
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
