import { ArrowUpRight, ArrowUp } from "lucide-react";
import { site } from "@/data/site";
export function Footer() {
  return (
    <footer className="footer page-pad">
      <div className="footer-top">
        <a href="#top" className="wordmark">
          XRISH<span>CREATIVES</span>
        </a>
        <p>
          Photography + Films
          <br />
          Laguna, Philippines
        </p>
        <nav aria-label="Footer navigation">
          <a href="#work">Work</a>
          <a href="#films">Films</a>
          <a href="#about">About</a>
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
