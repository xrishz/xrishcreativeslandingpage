"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { site } from "@/data/site";

export function Header() {
  const pathname = usePathname();
  const onHome = pathname === "/";
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
      <Link
        href={onHome ? "#top" : "/"}
        className="wordmark"
        aria-label="XRISH CREATIVES home"
      >
        XRISH<span>CREATIVES</span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        <Link
          href="/works"
          aria-current={pathname === "/works" ? "page" : undefined}
        >
          Work
        </Link>
        <Link href="/#films">Films</Link>
        <Link href="/#about">About</Link>
        <Link
          href="/experience"
          aria-current={pathname === "/experience" ? "page" : undefined}
        >
          Experience
        </Link>
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
            ["Work", "/works"],
            ["Films", "/#films"],
            ["About", "/#about"],
            ["Experience", "/experience"],
            ["Contact", "/#contact"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={
                (label === "Experience" && pathname === "/experience") ||
                (label === "Work" && pathname === "/works")
                  ? "page"
                  : undefined
              }
            >
              {label}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
