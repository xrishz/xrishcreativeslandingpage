# XRISH CREATIVES

A portfolio-first event photography and film website built from the supplied XRISH photographs. All **Message Us** links open the owner's confirmed Facebook page: https://www.facebook.com/xrishcreatives.

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
- `src/components/Viewer.tsx` provides a native modal dialog with keyboard photograph navigation, Escape close, focus restoration and an on-demand HTML video player.
- `src/components/camera/` separates model configuration, loading/fallback, model normalization, lighting, quality and rendering.
- `src/app/globals.css` contains the editorial design system and mobile composition.
- `PRODUCT.md`, `DESIGN.md`, and `.impeccable/` preserve the design decisions and Impeccable context.

## Portfolio content

The web images are real owner-supplied photographs, not stock or generated event imagery. Original files remain untouched in the local `PHOTOS` folder and are deliberately excluded from Git. Optimized WebP files, blur previews and source provenance are committed. On a fresh clone, you already have everything needed to run the website; originals are needed only to regenerate derivatives with `npm run media`.

Collection titles are editorial descriptions. No client dates, ages, locations, reviews, awards, pricing or availability have been invented. Khatrina's first name comes from the supplied filenames.

No playable event films or behind-the-scenes team photos were supplied. The film section links explicitly to the confirmed Facebook page. Add approved local MP4 files and optional WebVTT captions to `public/films`, then add entries to `films` in `src/data/site.ts` to enable the built-in accessible film viewer. Replace the About section's portfolio image with an approved team/production image when one becomes available.

## Replace the camera

The shipped camera is an original procedural, unbranded model compressed with Meshopt. Its source is `scripts/build-camera.mjs`.

1. Replace `public/models/xrish-camera.glb` with a licensed optimized model.
2. Face the lens along local +Z, with the top along +Y.
3. Adjust the rotation/scale/position in `src/components/camera/camera-config.ts` if needed.

Bounds are normalized automatically. Lighting, pointer damping, responsive framing and scroll behavior remain separate from mesh names. A failed WebGL context or model load falls back to a real photograph; visitors retain all navigation and contact actions. On phones and with reduced motion, rendering uses demand mode. Hidden/offscreen canvases stop continuous rendering.

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

This is a standard Next.js deployment. Configure `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin before the production build to enable canonical URLs and a populated sitemap. Without a confirmed domain, the application intentionally emits no invented canonical URL. OpenGraph artwork is a crop of a supplied XRISH photograph. No analytics, forms, database or third-party tracking scripts are included.

Pushing source to GitHub does not itself configure hosting. Production deployment and domain setup are separate decisions.
