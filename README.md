# XRISH CREATIVES

A photography and film portfolio for XRISH CREATIVES, led by Elrish John Rull in Laguna, Philippines. The site shows real client work and sends inquiries to the confirmed [XRISH Facebook page](https://www.facebook.com/xrishcreatives).

Live site: https://xrishcreatives.com. The [GitHub repository](https://github.com/xrishz/xrishcreativeslandingpage) deploys from `main` to Netlify. `https://xrish-creatives-portfolio.netlify.app` remains an alternate Netlify address.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production build, run `npm run build` and `npm start`. Checks are `npm run lint`, `npm run typecheck`, and `npm test` while the production server is running.

## Site and content

- Next.js App Router, React 19, TypeScript, Tailwind CSS 4, Motion, and an editorial paper/ink design system. The camera cursor appears only for fine-pointer devices; touch uses native input.
- The homepage leads with a rotating film hero and portfolio photographs. Our Works has Debuts, Predebuts, Corporate Events, and Graduation chapters; The XRISH Experience presents the team's real story. Weddings remain a service, but there is no wedding film chapter until approved footage exists.
- Four approved short films (Mirielle, Angel, Janelle, and Khatrina) use Cloudflare Stream adaptive playback, with local H.264/AAC files retained as a fallback. The hero changes on each refresh when session storage is available. The full predebut film remains an honest Coming soon placeholder.
- Four corporate and three graduation films use Cloudflare Stream players. Their small, muted looping previews are grayscale until the visitor selects Play; the full player then appears in color with sound controls. The Google Drive links are retained only as source references, never as public players.
- The separate latest-Facebook feature reads recent XRISH Page posts through a server-side Meta route, excludes the selected Mirielle and Angel reels, and presents only a candidate whose public embed reports playable video data. When none qualifies or the API is unavailable, it shows a compact link to the Page. This fetch is request-driven and cached; it is not a push notification to an already-open tab.
- Three named testimonials come from owner-provided screenshots. No awards, ratings, booking availability, event dates, or client facts were invented. All Message Us actions lead to Facebook.
- Keyboard navigation, focus-managed photo viewer, visible focus, reduced-motion behavior, mobile navigation, image fallback, and video loading/error states are implemented.

## Media delivery

`ASSETS/` holds the local source files and is excluded from Git. `public/portfolio/` holds high-quality WebP photo backups; `public/films/` holds short-film fallbacks, posters, and brief silent previews. `npm run media` regenerates portfolio derivatives from the originals. The original source files stay in the local asset folder.

The 26 portfolio photos and 11 film posters are hosted in Cloudflare Images. Their public IDs are recorded in `src/data/cloudflare-images.json`. `src/lib/cloudflare-images.ts` requests responsive widths at quality 90; the photo component falls back to its local WebP if hosted delivery fails. The site does not expose an Images API credential. Cloudflare Images flexible variants are enabled. Photo and video media remain viewable and retrievable by visitors; browser download-control hints are deterrents, not copy protection.

Cloudflare Stream customer and video IDs are public playback references in `src/data/site.ts`. Do not put an API token in source code or any `NEXT_PUBLIC_` variable. The fullscreen Stream player mounts after a visitor selects Play, while muted ambient previews use small local files. Captions and Stream origin restrictions can be set in the Cloudflare dashboard if required.

## Configuration

The public origin is `https://xrishcreatives.com`. Set `NEXT_PUBLIC_SITE_URL` to that value in hosting, and change it if the primary domain changes. The optional full-predebut placeholder can become a Stream film after an approved full video is uploaded:

```sh
NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE=18nmsvzvjt4m41a5
NEXT_PUBLIC_PREDEBUT_STREAM_VIDEO_ID=
```

The Meta integration uses server-only values:

```sh
FACEBOOK_PAGE_ID=113391138358438
FACEBOOK_PAGE_ACCESS_TOKEN=
FACEBOOK_GRAPH_API_VERSION=v26.0
```

Keep the Page token in Netlify's secret environment settings. Missing or failed Meta configuration gives visitors the Page fallback. The public route never returns the token. See `src/app/api/facebook/latest-video/route.ts` for the bounded candidate check.

## Verification

`npm test` runs the Playwright browser suite against `http://localhost:3000`, including route/navigation, mobile, film, viewer, fallback, reduced-motion, and accessibility checks. `node scripts/inspect.mjs` saves desktop/mobile screenshots for visual inspection. Confirm a production deploy by checking the custom domain, the Stream player, and Cloudflare-delivered images in a browser; a successful local build alone does not prove the live site.
