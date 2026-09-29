import { ArrowUpRight, ArrowUp } from "lucide-react";
import Link from "next/link";
import { site } from "@/data/site";
import { FooterReveal } from "./EditorialMotion";
export function Footer() {
  return (
    <FooterReveal>
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
          <Link href="/">Home</Link>
          <Link href="/works">Works</Link>
          <Link href="/about">About</Link>
          <Link href="/faq">FAQs</Link>
          <a href={site.messenger} target="_blank" rel="noopener noreferrer">
            Message Us <ArrowUpRight size={14} />
          </a>
          <a href={site.facebook} target="_blank" rel="noopener noreferrer">
            Facebook <ArrowUpRight size={14} />
          </a>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            Instagram <ArrowUpRight size={14} />
          </a>
          <a href={site.tiktok} target="_blank" rel="noopener noreferrer">
            TikTok <ArrowUpRight size={14} />
          </a>
        </nav>
        <a href="#top" className="back-top" aria-label="Back to top">
          <ArrowUp size={20} />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} XRISH CREATIVES</span>
        <strong>GOOD DAYS.<br />KEPT FOREVER.</strong>
      </div>
    </footer>
    </FooterReveal>
  );
}
