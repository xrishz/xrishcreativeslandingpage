# Verification — current screening-room release, 29 September 2026

## Meta feed and Stream playback follow-up — 29 September 2026

The XRISH Facebook Page's existing system user, Elrish Rull, now has Content and Insights access. The owner explicitly approved enabling Content; no other Page permission was changed. With the existing server-only read token, the live `/api/facebook/latest-video` route returned HTTP 200 and `status: ready` for a distinct PUP Sto. Tomas commencement reel. A live Chrome check opened the reel inside the site's Facebook embed and observed its playback position advance. Mirielle and Angel remain the curated films and are excluded from this automatic selection. The Page link remains the recovery path if a future reel cannot be embedded.

The short Cloudflare Stream previews could stall in Chrome because it reports native HLS as available but did not buffer these films through that path. The player now uses `hls.js` first where Media Source Extensions are available, with native HLS retained for browsers that need it. A local Chrome check observed buffered, advancing short films through blob-backed HLS, and Angel opened with sound and native controls on the first click. The Playwright film test now checks that Angel starts advancing after that click. ESLint, TypeScript, the production build and all 18 Playwright tests passed. This playback fix still needs a live check after publication.

## Live release checkpoint — 29 September 2026

Commit `82c9642` is published from GitHub `main` to `https://xrishcreatives.com/` through Netlify. The preceding media release added two Cloudflare Stream debut films (Angel and Khatrina) and two reaction films on The XRISH Experience (Cherrielle and Khatrina), with muted short previews and hosted posters. Corporate and graduation long films use a moving black-and-white preview that switches to color playback on the first click. The production browser check covered 1440px desktop and 390px mobile: the tested C&E corporate and PUP graduation films played on the first click, both reaction-film posters loaded, and neither viewport had horizontal overflow. Local ESLint, TypeScript, production build, and all **18 Playwright tests passed**.

At that checkpoint, the automatic Facebook feature returned HTTP 502 with the safe `unavailable` response. Netlify logs showed that a User token was rejected with OAuth error 190/2069032, while the Page-token retry received Graph HTTP 500/code 1 or timed out. Meta's Graph API Explorer confirmed that this post query requires a Page token. The follow-up above records the resolved Page access and live playback. No token values are stored in this document.

Three remaining supplied debut SDE files were blocked by Google Drive's download/view limit during import. Their direct Drive share URLs are not raw video URLs suitable for Cloudflare Stream URL import. They are not presented as playable films until their originals can be obtained and transcoded. The full predebut film remains Coming soon as requested. Right-click and drag deterrents are in place for photographs, but any image delivered to a browser remains retrievable through network tools or screenshots.

## Cloudflare media and site-wide refinement — 29 September

This release adds Cloudflare Images delivery for 26 portfolio photographs and 11 film posters, Cloudflare Stream playback for four short films and seven corporate/graduation films, a new PUP Sto. Tomas commencement film, moving grayscale preview loops for the long films, and a compact, clearer Our Works entry. The local original assets remain under the ignored `ASSETS/` folder; optimized local copies provide a backup. The full predebut film remains Coming soon until the owner provides it.

Fresh local checks: ESLint, TypeScript, production build, and all **17 Playwright tests passed**. Direct Cloudflare checks returned valid image responses for all 37 hosted image IDs and HTTP 200 manifests for all 11 Stream video IDs. A real Chrome review at desktop and mobile sizes confirmed the corporate previews advance, remain grayscale before selection, and open an advancing color Stream player after selection. The photographed homepage asset loaded through a Cloudflare `imagedelivery.net` responsive URL on both widths. A 15-case route audit across 320, 390, 768, 1440, and 1920 pixel viewports found no horizontal overflow, missing same-page anchors, dead `#` links, page errors, or serious/critical automated accessibility findings on the three routes. The category jump placed its heading below the sticky header on mobile and desktop.

The local Meta route returned a fallback HTTP 503 because no local Page token is configured. Production still needs fresh verification after the Netlify deployment; a local build and browser run do not establish live behavior. The Impeccable detector's remaining `broken-image` warning points to a regular expression that parses Facebook embed HTML, not an image element, and its typography/color notices compare against an older design-document ramp.

## Final refinement — 29 September

The coordinating agent reports **TypeScript, ESLint and the production build passed**, **all 16 Playwright tests passed**, including no-JavaScript and unavailable-session-storage loader coverage, and the final reviewer returned **SHIP**. Production-build testimonial measurements found **zero card overflow at 1440px, 390px and 320px**. The post-audit loader fix guards sessionStorage access and adds a noscript escape so the decorative overlay cannot block the portfolio when JavaScript is disabled. Typecheck, lint and build passed again after this fix. These are the supplied final validation results; this documentation-only pass did not rerun the checks or establish a new deployment.

Current source confirms the compact left-video/right-story lead, aligned video titles without category labels, native download deterrents, trusted Facebook preview image and complete pre-pipe title, bordered horizontal testimonial cards, approved one-paragraph Lara note, and cursor updates that avoid per-move React state churn. The Open Graph provenance records a branded 1200 × 630 homepage-hero capture using the supplied Mirielle film. Download deterrents do not prevent retrieval or recording of public browser video, and external sharing platforms can retain cached artwork.

## Screening-room foundation — 28 September

The final reviewer returned **SHIP**, with no blockers, for the XRISH cinematic screening room. The coordinating agent reports responsive verification at 1440px, 778px and 390px. The current hero uses all four approved native H.264/AAC films, selected on full refresh with immediate-repeat avoidance when session storage is available. A first-session paper/ink wordmark loader precedes the full-viewport opening. Ambient playback is muted and pauses offscreen; reduced motion begins paused. Watch the film restarts from zero, unmutes and exposes native controls, with sound coordination also handling native unmute.

Current source was inspected for the loader, hero selection, film playback, sound coordination and final CSS cascade. Design documentation and the sidecar were merged/refreshed without application edits. Reviewer screenshots include `desktop.png`, `mobile.png`, `user-778.png`, `loader.png`, `films-desktop.png`, `films-mobile.png` and `film-viewing.png` under `.impeccable/review`. Some intermediate film screenshots retain the earlier Hear the film label; current source and the final viewing interaction use Watch the film. This documentation pass did not independently rerun builds or browser tests and does not establish a new production deployment.

## Historical verification record — 22–23 September

The following sections retain earlier release evidence. Their fixed-image hero, two-Facebook-film descriptions and old sidecar-age note are historical and are superseded by the current release above.

Earlier requirements verified locally: the hero reads XRISH CREATIVES and uses the supplied MIRIELLE-50 portrait; the former 3D camera code, dependencies and assets are removed; all inquiry actions read Message Us and point to the confirmed XRISH Facebook page. The About introduction identifies Laguna and Elrish John Rull. The two Facebook reels that permit real inline playback and three client testimonials are included. Dedicated Our Works and The XRISH Experience routes are present.

Fine-pointer devices use the themed camera cursor with a restrained glow attached to the cursor disc. There is no independently animated trail to separate over photographs. The cursor does not mount for coarse/touch pointers.

## Automated checks

- Production Next.js build: passed.
- TypeScript: passed.
- ESLint: passed without warnings.
- Dependency audit: zero reported vulnerabilities.
- Twelve Playwright tests: passed, covering the Stream placeholder and playback URL validation, the exact five event types, the two browser-verified Our Works players, the automatic latest-video selector and rendered Facebook player, absence of failed Drive embeds and outbound film links, the two-column Graduation-ready layout, the three testimonials, the photographic hero, rotating landscape story with pause behavior, gallery navigation and focus restoration, inquiry destinations, responsive navigation, narrow layout, reduced motion, and serious/critical axe accessibility findings.
- Chrome desktop 1440px, phone 390px and narrow phone 320px: no runtime errors or horizontal document overflow.
- The About introduction renders as two lines at the verified desktop, tablet, 390px and 320px widths. Portfolio derivatives were regenerated from the supplied originals at WebP quality 90 and up to 3600 × 4800 pixels; the full-width About image requests a full-viewport responsive source.
- OpenGraph and Twitter artwork present in generated HTML.
- All 19 shipping photo and social-preview rasters have source provenance (embedded or sidecar), including the newly supplied STN07143 landscape.

## Impeccable review

Used product context, a route direction contract, layout/type/motion/adaptation/hardening/performance references, the mechanical detector, independent design and technical assessments, and an independent design documenter. The former 3D camera was ultimately replaced by the supplied Mirielle portrait. The portrait uses responsive high-resolution delivery, paper-toned edge gradients and reduced-motion-aware scroll drift.

The independent reviewer’s final disposition for `/`, `/works` and `/experience` was **SHIP**, as reported to this documentation pass by the coordinating agent. That review preceded the later removal of the unplayable Drive embeds. Current requirements include on-demand in-site Facebook players with loading/retry feedback, the Graduation two-column desktop and single-column mobile layout, Selected Stories count and pause controls, attached cursor glow, Event Coverage copy with casual language limited to debuts, and owner-supplied STN07143. Screenshots and local review evidence are in the gitignored `.impeccable/review` directory. Historical files there, including `technical-audit.md`, still describe the removed 3D camera and are not the current implementation verdict.

## Documentation verification

This pass compared `PRODUCT.md`, `DESIGN.md`, `README.md` and the three route briefs with the current route files, `InlineFilm`, `Portfolio`, `CameraCursor`, media data and responsive CSS. The player loading state clears on the iframe load event; a 15-second timeout exposes Try again, which remounts the iframe. The Graduation film area reserves two desktop columns and one column at 700px and below.

A separate real-browser check loaded the Facebook Debut iframe and exposed its Play, timeline, audio and fullscreen controls. Each supplied Google Drive preview resolved to the intended named file but then reported that the video could not be loaded. A direct `<video>` probe of the Graduation source returned `MEDIA_ELEMENT_ERROR: Format error`. In accordance with the owner's instruction to remove unplayable videos, all four Drive players were removed from the public route pending web transcoding.

Selected Stories uses a five-second timer and a 0.8-second crossfade. Explicit pause, hover or focus each stop the timer; reduced motion disables rotation and hides the Pause/Resume action while retaining the count. `STN07143.jpg` is owner-supplied and is included in the landscape sequence with recorded source provenance. The cursor glow is a box shadow on the positioned cursor disc, not a separately animated element. `/experience` expressly says Event Coverage, and both uses of the casual phrase refer to debut coverage.

No application code was edited and no build or browser tests were rerun by this documentation-only pass; the automated results above are the recorded implementation checks. The known `.impeccable/design.json` age mismatch is preserved: its generation timestamp is `2026-09-21T09:40:29.031Z`, so its previews and narrative do not represent the latest routes and behaviors. This pass did not regenerate or modify that sidecar.

## Automatic Facebook feature — 23 September 2026

The homepage keeps Mirielle and Angel as the selected films and places **Latest from XRISH** beneath them. The server route requests up to 20 recent managed Page posts, validates Facebook HTTPS permalinks, excludes those two curated reel IDs, skips photo-only posts, and checks up to eight remaining video candidates against Facebook’s public player response. It returns the newest candidate containing playable video data. It neither paginates nor sorts dates independently. Tokens remain server-only. Missing configuration, Graph API failures, blocked candidates and empty results return a safe fallback state without exposing provider error details.

Recorded local implementation verification passed for ESLint, TypeScript, the production build, all twelve Playwright tests, and desktop/mobile visual review. The automated browser tests stub `/api/facebook/latest-video` and block provider iframes; they verify selection and rendered player URLs, not live Meta authorization or real playback.

Production verification confirmed Graph API v26.0, Page ID 113391138358438, a permanent system-user credential stored as a server-only Netlify secret, Page Insights-only access, app Test access, and only `pages_show_list` plus `pages_read_engagement`. The live route successfully read the managed Page and initially selected Janelle’s 18 September 2026 reel. A real iframe check showed Facebook blocks that reel from embedding because it may contain third-party content, so the selector was hardened to require playable video data. Angel was then found playable but is already curated; the final selector explicitly excludes Angel and Mirielle. No different playable film exists among the current 20-post window, so the verified live result is the Facebook Page fallback rather than a repeated or broken player. No token value is recorded in source or documentation.

Source inspection confirms 1,800-second Graph and embed-check revalidation plus successful-response CDN headers of `s-maxage=1800, stale-while-revalidate=86400`. The browser fetches once per component mount, so this is not a hard 30-minute freshness guarantee or continuous polling. Facebook may change a reel’s eligibility after a cached check; the Page recovery link therefore remains visible for every selected result. The final implementation passed ESLint, TypeScript, the production build and all 12 Playwright tests. Live verification confirmed the automatic section does not repeat Mirielle or Angel and resolves to the safe Page fallback when no other recent film is embeddable.

## Boundaries

The following deployment observations are historical release evidence, not fresh production verification of this documentation pass or the newest route/player changes. The initial production Netlify build completed and reported the site live. The public homepage and sitemap returned HTTP 200 at https://xrish-creatives-portfolio.netlify.app/ ; the generated canonical URL matched that origin. A live Chrome check confirmed the requested title, event list, film placeholder, and gallery viewer. At a 390px live viewport, no camera canvas was present and the document had no horizontal overflow. Physical-device frame rate and field Core Web Vitals have not been measured. The film section retains the requested Full Pre-debut Film / Coming soon placeholder and an on-demand Cloudflare Stream integration; the owner elected to keep the placeholder for now. Live Stream playback awaits actual customer and video identifiers and is not claimed as tested. Browser checks found the Facebook plugin player usable for Mirielle and Angel. Facebook reported the other three supplied reels unavailable for embedding, so they are omitted.

Netlify supplies the final public origin through its build-time URL variable; NEXT_PUBLIC_SITE_URL can override it. The new Netlify project is connected to the GitHub `main` branch. No custom domain has been configured.
