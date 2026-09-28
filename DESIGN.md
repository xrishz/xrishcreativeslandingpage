---
name: XRISH CREATIVES
description: The XRISH cinematic screening room, with real films, paper and ink, and restrained editorial controls.
colors:
  paper: "#f5f4f0"
  ink: "#171715"
  muted: "#65645e"
  rule: "#d1d0c9"
  dark: "#111210"
  contact-surface: "#e8e6de"
  image-ground: "#dad7ce"
  film-ground: "#090a09"
  film-control: "#111210cc"
  film-copy: "#c9c8c0"
typography:
  display:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "clamp(78px, 10vw, 168px)"
    fontWeight: 600
    lineHeight: 0.82
    letterSpacing: "-0.065em"
  display-mobile:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "clamp(56px, 16vw, 78px)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.065em"
  headline:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "clamp(40px, 5vw, 74px)"
    lineHeight: 1
    letterSpacing: "-0.045em"
  film-headline:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "clamp(52px, 5.8vw, 88px)"
    fontWeight: 500
    lineHeight: 0.96
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "21px"
    fontWeight: 500
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "16px"
    lineHeight: 1.65
  label:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "10px"
    letterSpacing: "0.08em"
  film-title:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "clamp(22px, 2.4vw, 40px)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.035em"
  loader-mark:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "clamp(48px, 8vw, 118px)"
    fontWeight: 650
    lineHeight: 0.82
    letterSpacing: "-0.065em"
  text-link:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 500
rounded:
  circle: "50%"
spacing:
  gutter: "clamp(24px, 4.3vw, 80px)"
  text-link-gap: "32px"
  photo-strip-gap: "21px"
  photo-strip-gap-mobile: "14px"
  viewer-padding: "20px 40px 30px"
  viewer-padding-mobile: "16px 18px 30px"
components:
  film-control:
    backgroundColor: "{colors.film-control}"
    textColor: "{colors.paper}"
    padding: "0 14px"
  film-control-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.dark}"
  intro-loader:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "24px"
  text-link:
    textColor: "{colors.ink}"
    typography: "{typography.text-link}"
  icon-button:
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    width: "46px"
    height: "46px"
  site-header:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    height: "96px"
    padding: "0 clamp(24px, 4.3vw, 80px)"
  site-header-mobile:
    height: "80px"
  story-image:
    backgroundColor: "{colors.image-ground}"
    padding: "0"
    width: "100%"
  image-view:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "13px 18px"
  play-circle:
    textColor: "{colors.paper}"
    rounded: "{rounded.circle}"
    width: "60px"
    height: "60px"
  play-circle-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  viewer:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.paper}"
    width: "100%"
    height: "100%"
---

# Design System: XRISH CREATIVES

## Overview

**Creative North Star: "XRISH cinematic screening room"**

Real films lead the experience. Warm paper and near-black ink frame an immersive opening film, controlled oversized typography and an asymmetric screening sequence. Studio Yanagi’s film-forward restraint informs the direction, while the XRISH wordmark, supplied celebrations and local voice keep the identity specific to XRISH.

The interface stays quiet: short observational copy, micro-labels, fine rules and clear playback controls let real work supply color and feeling. Existing photographic spreads, honest client messages and the Facebook inquiry path remain useful parts of the same world. Route composition is recorded in `.impeccable/homepage-brief.md`, `.impeccable/works-brief.md` and `.impeccable/experience-brief.md`.

**Key Characteristics:**

- Full-viewport native film opening with the exact XRISH CREATIVES title.
- Paper/ink first-session wordmark introduction.
- Asymmetric editorial film sequencing and straight media edges.
- Quiet ambient previews with deliberate sound and full-player controls.
- Real photographs, owner-supplied testimonials and clear Facebook inquiries.

## Colors

The palette is warm and restrained; real films and photographs provide the saturated color. Frontmatter records the canonical values extracted from `src/app/globals.css`.

### Primary

- **Gallery Ink** (`ink`): primary text and underlined inquiry actions. The visual emphasis comes from contrast and scale rather than a colored brand accent.

### Neutral

- **Gallery Paper** (`paper`): page and navigation ground, light image actions, and text on the dark film surface.
- **Warm Gray** (`muted`): secondary captions and supporting copy on light surfaces.
- **Quiet Rule** (`rule`): header, section, footer and event-row dividers.
- **Screening Black** (`dark`): film section and full-screen viewer background.
- **Contact Stone** (`contact-surface`): the closing inquiry area, gently distinct from the page ground.
- **Image Ground** (`image-ground`): background behind story photographs while content resolves.
- **Film Ground** (`film-ground`): native player background.
- **Film Control** (`film-control`): translucent ink behind preview controls.
- **Film Copy** (`film-copy`): supporting text in the dark screening sequence.

**The Photography Color Rule.** Let supplied films and photographs supply vivid color; keep the interface within the observed neutral palette.

## Typography

**Display and body font:** Instrument Sans, with a sans-serif fallback. The font is loaded with `next/font/google` and exposed as `--font-instrument`.

Headings use compact leading and negative tracking. Smaller uppercase labels use positive tracking. There is no separate decorative serif or monospace family, and no single mathematical type scale: the implemented sizes respond to each editorial role.

### Hierarchy

- **Display:** the desktop hero uses `typography.display`; mobile uses `typography.display-mobile`. Between 701px and 1100px the hero size is `clamp(68px, 11.6vw, 122px)`. The hero text is exactly **XRISH CREATIVES**, arranged on two lines.
- **Headline:** selected-stories headings use `typography.headline`; on mobile this becomes (37px), with a (1.04) line height. Other section titles retain their role-specific responsive sizes rather than all becoming the hero style.
- **Film headline:** `typography.film-headline` sets the large screening-room heading. Mobile uses `clamp(48px, 14vw, 58px)`.
- **Film title:** `typography.film-title` uses close tracking and a single-line leading; mobile titles use (25px). The loader uses `typography.loader-mark`, with a small tracked CREATIVES line below.
- **Title:** story names use `typography.title`, becoming (20px) on mobile.
- **Body:** `typography.body` records the approach paragraph style; mobile uses (14px). Supporting copy elsewhere uses (13–17px), and the about introduction uses a distinct larger (24px) paragraph. Preserve these role differences.
- **Label:** `typography.label` records the contact-sheet label role. Supporting metadata ranges from (9–12px), with tabular numerals for photograph counts.

**The Exact Name Rule.** Preserve the hero wording XRISH CREATIVES; supporting copy must not replace the brand headline.

## Layout

The shared page gutter is `spacing.gutter`. Full-width photography breaks out of that alignment where the current composition calls for it. At viewport widths of 1700px and above, the site is centered within a maximum width of (1920px). The header is (96px) high on desktop and (80px) at 700px and below.

Desktop stories form an asymmetric two-column spread (1.04fr / 0.8fr), with an (11vw) gap and a (190px) vertical offset on the second story. At 1100px and below the gap becomes (7vw) and the offset becomes (120px). At 700px and below stories become staggered blocks at (88%) width, with a (44px) offset and (3:4) photographs. Desktop story portraits use (4:5). Preserve this editorial rhythm rather than equalizing every photograph into cards.

The horizontal contact sheet uses (285px) figures, alternating vertical offsets of (48px), and proximity scroll snapping. Mobile figures use (72vw), with a (36px) alternating offset. It remains horizontally scrollable by touch, keyboard and the visible directional buttons.

The hero is a full-width native video field beneath the header, with minimum height `calc(100svh - 96px)` on desktop and `calc(100svh - 80px)` on mobile. Video covers the field; dark directional scrims protect the pale two-line wordmark and observational copy. Mobile retains the film rather than substituting a fixed portrait, and places compact sound and playback controls beside the location label.

The homepage film sequence starts with a compact left-video/right-story composition: a 7fr video column and a story column with a minimum width of (280px), separated by `clamp(38px, 5vw, 84px)`. Film titles sit directly below and align with the left edge of each video; visible category labels are removed. The remaining sequence keeps its twelve-column grid: second film occupies columns 1–7, third 8–12 aligned low, and fourth 3–11. Vertical gaps are `clamp(64px, 8vw, 130px)`. At 700px and below the lead story stacks beneath its video, and films stack with (72px) separation. Native film stages use (16:9). The `/works` native-film chapters use two staggered columns on desktop and one column on mobile. Final responsive review covered widths (1440px), (778px) and (390px).

Coverage and about content collapse to a single column on mobile. Film imagery becomes edge-to-edge, with the caption moved toward the bottom and a vertical scrim. The viewer uses the safe viewport height and contains the full photograph without cropping.

## Elevation & Depth

The gallery is predominantly flat. Tonal surfaces, hairline dividers, photographic cropping and open space provide hierarchy. Do not add shadowed card containers to the editorial spreads.

The mobile menu has a restrained separation shadow (`0 15px 25px #1111110a`). The opening film uses layered ink-to-transparent gradients to protect the pale wordmark without flattening the supplied footage. Photo captions use soft text shadows only where needed over imagery. Film scrims protect readability: a horizontal black-to-transparent gradient on desktop becomes vertical on mobile. Current motion and shadow values are defined in `src/app/globals.css` and their affected components. The `.impeccable/design.json` sidecar was refreshed with this screening-room documentation pass; it extends the frontmatter with motion, responsive metadata and representative component previews.

**The Flat Gallery Rule.** Keep photographic surfaces flat; use gradients only for photographic blending and readability.

## Shapes

Photographs, editorial regions and viewer surfaces keep straight edges. Circular geometry identifies previous/next, close, back-to-top and the secondary full-film destination. Native film preview controls are restrained rectangular outlines; entering full viewing exposes the browser’s familiar media controls. Circular icon controls are (46px) square, and the back-to-top control is (44px). Film controls are (60px), becoming (52px) on mobile.

Use thin rules for division and underlining for text actions. Avoid introducing pill-shaped inquiry buttons or rounded image cards. There is no general rounded-panel component in the current system.

## Components

### Text actions and inquiry links

Underlined text and a directional icon provide the primary action language. General text links have a minimum height of (44px), `spacing.text-link-gap` between content and icon, and a (1px) current-color underline. Their icon shifts (3px, -3px) on hover over (0.25s). The larger closing inquiry uses a (5px, -5px) icon shift over (0.3s).

All inquiry calls to action read **Message Us** and point to `https://www.facebook.com/xrishcreatives`. Links opening a new tab carry `rel="noopener noreferrer"`. Film exploration is a content link with its own explicit Facebook label, not an inquiry form.

### Icon buttons

Circular controls are transparent at rest and gain a current-color (10%) transparent mix on hover, over (0.2s). Icons use (1.5) stroke width. Give icon-only controls an accessible name. Disabled buttons use (0.45) opacity and a not-allowed cursor. Film preview buttons currently use a (44px) minimum height on desktop and (40px) on mobile; hero controls remain (44px). All keyboard-focusable actions use a (2px) current-color outline with a (6px) offset.

### Camera cursor

Fine-pointer desktop devices use a small Gallery Ink camera cursor on a translucent Gallery Paper disc. The glow is the disc’s own box shadow, and both use the same pointer position; there is no independently animated trail to separate over large photographs. Interactive targets, including native video controls, invert the disc colors. Pointer movement updates position and visual flags without a React state update on every move, keeping the custom cursor stable. It hides on window blur or pointer exit. Touch devices retain their native behavior.

### Our Works

The `/works` route keeps four anchored chapters: Debuts, Predebuts, Corporate Events and Graduation. Debuts displays Angel and Janelle; Predebuts displays Mirielle and Khatrina using the shared native film component. Desktop pairs are staggered and collapse to one column on mobile. Corporate Events and Graduation retain quiet preparation lines because their supplied Drive masters were not browser-playable. The Graduation area remains ready for two desktop columns, becoming one at 700px and below.

### The XRISH Experience

The /experience route carries the homepage's warm paper and screening-black rhythm into a concise studio story. Its centered two-line title and supplied 2023 origin paragraph identify the studio’s specialization as Event Coverage and lead into a full-width photograph, followed by a dark asymmetric image spread and the closing Facebook inquiry. Casual “fun and chill, parang laro lang” language remains explicitly attached to debut coverage.

### Navigation

The wordmark is a two-line typographic mark. Desktop navigation provides Work (`/works`), Films (`/#films`), About (`/#about`) and Experience (`/experience`), with a separate Message Us link. Work and Experience expose the current route through `aria-current="page"`. The shared header is sticky at the top of every route, with a nearly opaque Gallery Paper surface and restrained backdrop blur so navigation remains legible over photographs and films. Mobile keeps Message Us visible and replaces the middle navigation with a (44px) menu toggle. Its expanded panel stays attached below the sticky header, uses large ruled links, closes after selection, and closes with Escape while restoring focus to the toggle.

### Story photographs and contact sheet

The full-width Selected Stories lead rotates among three landscape photographs every five seconds with a restrained crossfade. A visible two-digit count and Pause/Resume control give visitors direct control; pointer hover anywhere within the lead story and keyboard focus anywhere inside it also pause the rotation. Rotation resumes only after explicit pause is cleared and neither hover nor focus remains. Reduced-motion mode keeps a static landscape and omits the unnecessary Pause/Resume control. The crossfade lasts (0.8s). Owner-supplied `PHOTOS/STN07143.jpg` supplies the warm golden-light frame in this sequence; its optimized derivative retains source provenance.

Story photographs are buttons with explicit View labels, rather than decorative cards. Hover scales the image to (1.025) over (0.75s); the small View story action appears on hover or keyboard focus. It stays visible on mobile. The reusable Photo component uses responsive `sizes`, a blur placeholder, meaningful alternative text and an unavailable-image fallback. Gallery images crop with `cover`; the viewer uses `contain` to show the complete frame.

### Films

The curated sequence contains four approved native H.264/AAC films: Mirielle, Angel, Janelle and Khatrina. Their posters come from the supplied films. Muted inline looping previews provide atmosphere; non-priority sources are attached as they approach the viewport, and offscreen playback pauses. Manual pause is respected. Reduced motion starts previews paused and removes entry translation.

**The Deliberate Sound Rule.** Ambient motion begins muted. **Watch the film** restarts at time zero, unmutes, and replaces the custom overlay actions with native controls for timeline, seeking, volume and fullscreen. Shared sound coordination mutes the other native films and hero whenever one claims sound, including unmute through native controls. Preserve one audible native source at a time.

Native film elements request `nodownload` and `noremoteplayback`, disable picture-in-picture and remote playback, disable dragging, and suppress the video context menu. These are browser-dependent download deterrents, not DRM: publicly delivered video can still be retrieved or recorded. Preserve timeline, seeking, volume and fullscreen in viewing mode.

The films enter with a restrained (48px) vertical reveal over (0.85s). Preview controls use quiet borders and invert to paper on hover over (220ms). Do not put card shells around the films. The separate Full Pre-debut Film / Coming soon feature and future on-demand Cloudflare integration remain distinct from these working native films.

The automatic Facebook section remains a secondary feature, currently headed **Fresh from the page.** It uses the server-only managed Page route, excludes the original curated Mirielle/Angel reel IDs and verifies candidate embed responses. The play surface uses the post’s preview image when a trusted HTTPS Facebook/CDN image is available. Its title preserves the complete caption segment before the first pipe character, falling back to the first sentence or the generic title; it is not shortened to a fixed character count. Play mounts the selected Facebook iframe with loading and retry feedback; the recovery Page link remains available. These external embeds do not participate in native-video sound coordination. Keep them distinct from the four approved native films.

### Testimonials

The three owner-supplied client messages appear in bordered horizontal cards on a warm neutral ground. The scroll-snap track supports swiping, arrow keys, previous/next buttons and indexed selection. Cards share a fixed track height of `clamp(410px, 30vw, 460px)` on desktop and (440px) at 700px and below, with attribution pinned toward the bottom. Desktop cards use `minmax(520px, 62%)` width; mobile cards fill the track width.

Use the shared Instrument Sans family, restrained weight and compact spacing. Lara’s approved proofread note is one paragraph, with a smaller long-form type size to fit the same compact card height; do not imply that all quotes use the same font size. Preserve each client’s attribution and intended meaning. Do not add unsupported ratings or avatars. Production-build measurements found no card overflow at 1440px, 390px or 320px.

### Viewer

The photograph viewer is a native modal dialog with a full dark canvas, title, close action, photograph count and directional controls. Opening it locks body scrolling; closing it restores previous focus. Escape closes it, and arrow keys move through photographs. The photo changes with a short (0.16s) opacity transition. Reduced-motion mode suppresses that opacity change. Retain the readable title and visible controls on mobile.

### Social sharing preview

The Open Graph/Messenger image is a branded (1200 × 630px) capture of the homepage hero using the supplied Mirielle film. It includes navigation, the XRISH wordmark and hero copy over an authentic film frame. Preserve its source-provenance sidecar. This is the intended sharing artwork; external platforms may retain an older cached preview.

### Opening film

The opening film is selected from all four approved native films on each full document refresh. Session storage records the prior choice and avoids an immediate repeat; if storage is unavailable, selection remains random but repeat avoidance cannot be guaranteed. This is a refresh-time choice, not an automatic four-film carousel within a visit. The hero loops muted, pauses offscreen and starts paused under reduced motion. Its explicit sound and pause/play controls remain available.

### First-session introduction

A paper/ink XRISH wordmark overlays the first visit in a browser session, with a thin progress line. The normal first-session delay is (1.65s), followed by a (0.55s) fade; reduced motion uses a brief (350ms) hold and no exit motion. Session storage suppresses the hold on later visits in that session. Storage access is guarded, and a noscript escape hides the decorative overlay when JavaScript is disabled, keeping the underlying portfolio accessible. This is a timed brand introduction, not a measured media-download percentage.

## Do's and Don'ts

### Do:

- **Do** preserve XRISH CREATIVES as the exact hero headline.
- **Do** keep inquiry labels as Message Us and point them to the confirmed Facebook page.
- **Do** use actual supplied photography with accurate alternative text and responsive image sizing.
- **Do** preserve warm neutral surfaces, straight image edges and staggered editorial spacing.
- **Do** keep visible keyboard focus, minimum 44px controls and reduced-motion alternatives.
- **Do** keep all four approved native films eligible for the opening and preserve refresh-time repeat avoidance.
- **Do** restart Watch the film from zero and expose native controls with one audible native source.
- **Do** keep event types limited to Debut, Predebut, Weddings, Corporate Events and Graduations.

### Don't:

- **Don't** substitute generic rounded card grids for the photographic spreads.
- **Don't** introduce decorative interface colors that compete with the photographs.
- **Don't** invent testimonials, awards, statistics, client identities, dates or locations beyond the owner-supplied Laguna location and named client feedback.
- **Don't** make mobile interactions depend on hover or hide the only path to an action.
- **Don't** autoplay audio or hijack scrolling.
- **Don't** present a photograph as a working embedded film before an actual film asset is supplied.
