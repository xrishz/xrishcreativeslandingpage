# XRISH CREATIVES

A portfolio-first event photography and film website built from the supplied XRISH photographs. All **Message Us** links open the owner's confirmed Facebook page: https://www.facebook.com/xrishcreatives.

Portfolio photographs are generated from the original files at up to 3600 × 4800 pixels and WebP quality 90. Next.js serves responsive versions at quality 90 so wide and high-density displays remain sharp without forcing every device to download the largest file.

Live site: https://xrish-creatives-portfolio.netlify.app/ . The Netlify project is connected to `xrishz/xrishcreativeslandingpage` on `main` for automatic deployments. The earlier `xrishcreatives.netlify.app` project remains separate.

## Run locally

Requires Node.js 20.9 or newer and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For the production build:

```sh
npm run build
npm start
```

## Architecture

- Next.js App Router, React 19, TypeScript and Tailwind CSS 4.
- Motion owns DOM scroll motion and photo-viewer transitions; no competing animation library.
- Fine-pointer devices use a small camera cursor with a restrained attached glow; touch devices keep native input behavior.
- The /works route presents Debuts, Predebuts, Corporate Events, and Graduation. Its two browser-verified Facebook films use on-demand in-page players with loading and retry feedback.
- The homepage keeps Mirielle and Angel as its curated films and adds a separate **Latest from XRISH** feature. A server-only Meta Graph API route finds the newest video among the Page's recent posts, uses a 30-minute cache revalidation window, and falls back to the Facebook Page when Meta is unavailable. The iframe mounts only after the visitor presses Play and includes loading, timeout and retry feedback.
- Selected Stories rotates three landscape photographs every five seconds, including owner-supplied `STN07143.jpg`. A visible count and Pause/Resume control accompany it; hover and focus pause rotation, and reduced motion keeps the landscape static.
- The /experience route presents the supplied 2023 XRISH origin story with Event Coverage as the specialization. The phrase “fun and chill, parang laro lang” is limited to debut coverage.
- `src/data/site.ts` contains portfolio collections, photograph descriptions, the confirmed contact link, and the film content interface.
- `src/components/Viewer.tsx` provides a native modal dialog with keyboard photograph navigation, Escape close, focus restoration and an on-demand Cloudflare Stream player.
- `src/app/globals.css` contains the editorial design system and mobile composition.
- `PRODUCT.md`, `DESIGN.md`, and `.impeccable/` preserve the design decisions and Impeccable context.

## Portfolio content

The web images are real owner-supplied photographs, not stock or generated event imagery. Original files remain untouched in the local `PHOTOS` folder and are deliberately excluded from Git. Optimized WebP files, blur previews and source provenance are committed. On a fresh clone, you already have everything needed to run the website; originals are needed only to regenerate derivatives with `npm run media`.

Collection titles are editorial descriptions. No client dates, ages, locations, reviews, awards, pricing or availability have been invented. Khatrina's first name comes from the supplied filenames.

The only event categories are Debut, Predebut, Weddings, Corporate Events, and Graduations, as confirmed by the owner.

Mirielle's Pre-debut Film and Angel's Debut Same Day Edit play directly in the homepage Films section through Facebook's lazy-loaded embedded player. The explicit play surfaces with loading/retry states are used on `/works`. Facebook blocks embedding for the other three supplied reels, so they are omitted from the site. The full Pre-debut Film placeholder remains separate from these short reels.

### Automatic latest Facebook film

The **Latest from XRISH** feature does not replace the two selected portfolio films. It reads up to 20 recent XRISH CREATIVES Page posts through Meta's Pages API, skips photo-only posts and invalid Facebook HTTPS permalinks, and selects the first qualifying video or reel in the order returned by Meta. It does not paginate through older posts or independently sort their dates. The credential stored in `FACEBOOK_PAGE_ACCESS_TOKEN` stays on the server and is never returned to the browser.

Configure these server-side values locally in `.env.local` and in Netlify:

```sh
FACEBOOK_PAGE_ID=113391138358438
FACEBOOK_PAGE_ACCESS_TOKEN=
FACEBOOK_GRAPH_API_VERSION=v26.0
```

The recorded production setup uses Graph API **v26.0**, Page ID **113391138358438**, and a Meta system user assigned **Page Insights-only access** plus **Test access to the app**, with token permissions `pages_show_list` and `pages_read_engagement`. These are the configured assignments for this integration, not a requirement to grant full Page or business control. Store the credential as Netlify's server-only secret `FACEBOOK_PAGE_ACCESS_TOKEN`; the blank value above is intentional. Never put a token in documentation, source control or a `NEXT_PUBLIC_` variable.

The public route returns a status and the selected video's ID, title, excerpt, date and Facebook permalink. Its Graph fetch uses 1,800-second revalidation; successful responses use `s-maxage=1800, stale-while-revalidate=86400`. This is request-driven caching, not a scheduled sync or a guaranteed 30-minute publishing deadline. The browser fetches once when the feature mounts and does not poll, so an already-open page needs a reload or remount to request a newer result. Missing configuration and provider failures return uncached fallback responses.

Selecting a video attachment does not verify that Facebook permits embedding or that playback succeeds. The feature retains a **View post on Facebook** link for a selected result, while missing configuration, API errors and an empty result show the Page fallback. The iframe mounts only after Play is pressed and presents loading plus a 15-second retry state. It does not automatically detect an error displayed inside Facebook's cross-origin player. The two curated films remain separate from this automatic selection.

The Our Works page reuses the two browser-verified Facebook films for Debuts and Predebuts. The supplied Corporate Events and Graduation Google Drive previews were removed from the public page after live browser checks reached the correct files but Google reported that each video could not be loaded. Direct playback also failed with a media format error. Their source references remain recorded for later transcoding through Cloudflare Stream or another web video service. Graduation retains a two-column desktop film area ready for two web-ready videos and returns to one column on mobile.

Three named client testimonials were transcribed from the owner's supplied screenshots and displayed without inferred star ratings or reused avatars. The About introduction and location metadata say Laguna, Philippines, as confirmed by the owner.

The Films section includes a **Full Pre-debut Film** placeholder using a real portfolio photo, labelled **Coming soon**. Cloudflare Stream is the chosen future video provider; the owner requested the placeholder for now. Until configured, no player is mounted and no request is made to Cloudflare. No video or client identity is fabricated.

To connect the film:

1. Upload the approved film in Cloudflare Stream and wait for it to be ready.
2. Copy the public customer code and video UID from its Stream embed code.
3. Set `NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE` and `NEXT_PUBLIC_PREDEBUT_STREAM_VIDEO_ID` in `.env.local` and the hosting environment (see `.env.example`). Use only the customer code, without `customer-` or the domain suffix.
4. Rebuild. The placeholder automatically becomes **Watch full film** and opens the responsive Stream player in the film viewer.

Video UID and customer code are public playback identifiers, not API keys. Never expose a Cloudflare API token in a `NEXT_PUBLIC_` variable. Playback uses the official customer Stream iframe URL, loaded only after a visitor chooses Watch full film; autoplay is omitted. Configure captions and allowed origins in Stream. Signed/private videos need a server-generated playback token before using this public-portfolio integration.

No paid Cloudflare service or uploaded film has been provisioned by this code change. Replace the About section's portfolio image with an approved team/production image when available.

## Design documentation status

`DESIGN.md` and the three route briefs describe the current implementation. `.impeccable/design.json` remains deliberately unchanged with `generatedAt: 2026-09-21T09:40:29.031Z`; its component previews and narrative have a known age mismatch. Treat the sidecar as an older reference, not current proof of the routes or interactions.

## Validation

```sh
npm run lint
npm run typecheck
npm run build
# Start the production server in another terminal first:
npm test
```

Browser tests use an installed Google Chrome. Update the channel in `playwright.config.ts` if using Playwright-managed Chromium instead. Tests cover the photographic hero, gallery navigation/focus, the contact destination, mobile menu and scrolling, narrow layout, reduced motion, and serious/critical automated accessibility findings. `node scripts/inspect.mjs` saves desktop/mobile screenshots for visual review. These are local/emulated checks, not a claim of physical-device or field performance testing.

## Hosting and SEO

This is a standard Next.js deployment. On Netlify, the build uses Netlify's provided `URL` as the canonical origin. Set `NEXT_PUBLIC_SITE_URL` if a different confirmed public origin is needed. Without a confirmed origin, the application emits no invented canonical URL. OpenGraph artwork is a crop of a supplied XRISH photograph. No first-party analytics, forms or database are included. Facebook players are third-party embeds and load only when mounted; the future Cloudflare player is also external.

The Netlify project currently serves its `netlify.app` address. A custom domain can be added later without changing the repository structure.
