import { ArrowUpRight, ArrowUp } from "lucide-react";
import Link from "next/link";
import { site } from "@/data/site";
export function Footer() {
  return (
    <footer className="footer page-pad">
      <div className="footer-top">
        <Link href="/" className="wordmark">
          XRISH<span>CREATIVES</span>
        </Link>
        <p>
          Photography + Films
          <br />
          Laguna, Philippines
        </p>
        <nav aria-label="Footer navigation">
          <Link href="/works">Work</Link>
          <Link href="/#films">Films</Link>
          <Link href="/#about">About</Link>
          <Link href="/experience">Experience</Link>
          <a href={site.facebook} target="_blank" rel="noopener noreferrer">
            Facebook <ArrowUpRight size={14} />
          </a>
        </nav>
        <a href="#top" className="back-top" aria-label="Back to top">
          <ArrowUp size={20} />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} XRISH CREATIVES</span>
        <span>GOOD DAYS. KEPT FOREVER.</span>
      </div>
    </footer>
  );
}
