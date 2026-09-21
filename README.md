# XRISH CREATIVES

A portfolio-first event photography and film website built from the supplied XRISH photographs. All **Message Us** links open the owner's confirmed Facebook page: https://www.facebook.com/xrishcreatives.

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
- React Three Fiber, Drei and Three.js power the isolated, lazy-loaded camera.
- `src/data/site.ts` contains portfolio collections, photograph descriptions, the confirmed contact link, and the film content interface.
- `src/components/Viewer.tsx` provides a native modal dialog with keyboard photograph navigation, Escape close, focus restoration and an on-demand Cloudflare Stream player.
- `src/components/camera/` separates model configuration, loading/fallback, model normalization, lighting, quality and rendering.
- `src/app/globals.css` contains the editorial design system and mobile composition.
- `PRODUCT.md`, `DESIGN.md`, and `.impeccable/` preserve the design decisions and Impeccable context.

## Portfolio content

The web images are real owner-supplied photographs, not stock or generated event imagery. Original files remain untouched in the local `PHOTOS` folder and are deliberately excluded from Git. Optimized WebP files, blur previews and source provenance are committed. On a fresh clone, you already have everything needed to run the website; originals are needed only to regenerate derivatives with `npm run media`.

Collection titles are editorial descriptions. No client dates, ages, locations, reviews, awards, pricing or availability have been invented. Khatrina's first name comes from the supplied filenames.

The only event categories are Debut, Predebut, Weddings, Corporate Events, and Graduations, as confirmed by the owner.

The Films section includes a **Full Pre-debut Film** placeholder using a real portfolio photo, labelled **Coming soon**. Cloudflare Stream is the chosen future video provider; the owner requested the placeholder for now. Until configured, no player is mounted and no request is made to Cloudflare. No video or client identity is fabricated.

To connect the film:

1. Upload the approved film in Cloudflare Stream and wait for it to be ready.
2. Copy the public customer code and video UID from its Stream embed code.
3. Set `NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE` and `NEXT_PUBLIC_PREDEBUT_STREAM_VIDEO_ID` in `.env.local` and the hosting environment (see `.env.example`). Use only the customer code, without `customer-` or the domain suffix.
4. Rebuild. The placeholder automatically becomes **Watch full film** and opens the responsive Stream player in the film viewer.

Video UID and customer code are public playback identifiers, not API keys. Never expose a Cloudflare API token in a `NEXT_PUBLIC_` variable. Playback uses the official customer Stream iframe URL, loaded only after a visitor chooses Watch full film; autoplay is omitted. Configure captions and allowed origins in Stream. Signed/private videos need a server-generated playback token before using this public-portfolio integration.

No paid Cloudflare service or uploaded film has been provisioned by this code change. Replace the About section's portfolio image with an approved team/production image when available.

## Replace the camera

The shipped camera is an original procedural, unbranded model compressed with Meshopt. Its source is `scripts/build-camera.mjs`.

1. Replace `public/models/xrish-camera.glb` with a licensed optimized model.
2. Face the lens along local +Z, with the top along +Y.
3. Adjust the rotation/scale/position in `src/components/camera/camera-config.ts` if needed.

Bounds are normalized automatically. Lighting, pointer damping, responsive framing and scroll behavior remain separate from mesh names. A failed WebGL context or model load falls back to a real photograph; visitors retain all navigation and contact actions. At 700px and below, the entire camera is unmounted and its 3D assets are not loaded, as requested. The mobile hero leads directly into a real photograph. Reduced motion uses demand rendering. Hidden/offscreen canvases stop continuous rendering.

Rebuild the original asset with `node scripts/build-camera.mjs`.

## Validation

```sh
npm run lint
npm run typecheck
npm run build
# Start the production server in another terminal first:
npm test
```

Browser tests use an installed Google Chrome. Update the channel in `playwright.config.ts` if using Playwright-managed Chromium instead. Tests cover gallery navigation/focus, the contact destination, mobile menu and scrolling, narrow layout, reduced-motion/WebGL fallback, and serious/critical automated accessibility findings. `node scripts/inspect.mjs` saves desktop/mobile screenshots for visual review. These are local/emulated checks, not a claim of physical-device or field performance testing.

## Hosting and SEO

This is a standard Next.js deployment. On Netlify, the build uses Netlify's provided `URL` as the canonical origin. Set `NEXT_PUBLIC_SITE_URL` if a different confirmed public origin is needed. Without a confirmed origin, the application emits no invented canonical URL. OpenGraph artwork is a crop of a supplied XRISH photograph. No analytics, forms, database or third-party tracking scripts are included.

The Netlify project currently serves its `netlify.app` address. A custom domain can be added later without changing the repository structure.
