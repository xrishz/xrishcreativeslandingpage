---
name: XRISH CREATIVES
description: A warm photographic gallery with precise typography and dark film intervals.
colors:
  paper: "#f5f4f0"
  ink: "#171715"
  muted: "#65645e"
  rule: "#d1d0c9"
  dark: "#111210"
  contact-surface: "#e8e6de"
  image-ground: "#dad7ce"
typography:
  display:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "clamp(76px, 9.2vw, 154px)"
    fontWeight: 600
    lineHeight: 0.94
    letterSpacing: "-0.055em"
  display-mobile:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "clamp(48px, 13.8vw, 96px)"
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: "-0.052em"
  headline:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "clamp(40px, 5vw, 74px)"
    lineHeight: 1
    letterSpacing: "-0.045em"
  film-headline:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "clamp(55px, 7.2vw, 106px)"
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

**Creative North Star: "The Photographic Gallery"**

Warm gallery white, near-black, precise sans type, open asymmetric spreads and dark screening-room intervals define the implemented world. Photography supplies the vivid color. The interface frames genuine work with quiet rules, generous space and a clear route to a conversation.

The treatment is editorial, cinematic and human. Large tightly spaced headings establish scale; restrained labels and plain language let the photographs carry the emotional detail. This document records the current implementation and the confirmed brand direction. The homepage composition and story sequence remain in `.impeccable/homepage-brief.md`.

**Key Characteristics:**

- Warm neutral surfaces with near-black text.
- Oversized Instrument Sans headings and discreet supporting labels.
- Straight photographic edges, staggered spreads and open space.
- Dark film presentation with circular action controls.
- Purposeful motion with keyboard, touch and reduced-motion equivalents.

## Colors

The palette is warm and restrained; the photographs provide the saturated color. Frontmatter records the canonical values extracted from `src/app/globals.css`.

### Primary

- **Gallery Ink** (`ink`): primary text and underlined inquiry actions. The visual emphasis comes from contrast and scale rather than a colored brand accent.

### Neutral

- **Gallery Paper** (`paper`): page and navigation ground, light image actions, and text on the dark film surface.
- **Warm Gray** (`muted`): secondary captions and supporting copy on light surfaces.
- **Quiet Rule** (`rule`): header, section, footer and event-row dividers.
- **Screening Black** (`dark`): film section and full-screen viewer background.
- **Contact Stone** (`contact-surface`): the closing inquiry area, gently distinct from the page ground.
- **Image Ground** (`image-ground`): background behind story photographs while content resolves.

**The Photography Color Rule.** Let supplied photographs supply vivid color; keep the interface within the observed neutral palette.

## Typography

**Display and body font:** Instrument Sans, with a sans-serif fallback. The font is loaded with `next/font/google` and exposed as `--font-instrument`.

Headings use compact leading and negative tracking. Smaller uppercase labels use positive tracking. There is no separate decorative serif or monospace family, and no single mathematical type scale: the implemented sizes respond to each editorial role.

### Hierarchy

- **Display:** the desktop hero uses `typography.display`; mobile uses `typography.display-mobile`. Between 701px and 1100px the hero size is (9vw). The hero text is exactly **XRISH CREATIVES**, arranged on two lines.
- **Headline:** selected-stories headings use `typography.headline`; on mobile this becomes (37px), with a (1.04) line height. Other section titles retain their role-specific responsive sizes rather than all becoming the hero style.
- **Film headline:** `typography.film-headline` sets the large screening-room heading. Mobile uses (66px).
- **Title:** story names use `typography.title`, becoming (20px) on mobile.
- **Body:** `typography.body` records the approach paragraph style; mobile uses (14px). Supporting copy elsewhere uses (13–17px), and the about introduction uses a distinct larger (24px) paragraph. Preserve these role differences.
- **Label:** `typography.label` records the contact-sheet label role. Supporting metadata ranges from (9–12px), with tabular numerals for photograph counts.

**The Exact Name Rule.** Preserve the hero wording XRISH CREATIVES; supporting copy must not replace the brand headline.

## Layout

The shared page gutter is `spacing.gutter`. Full-width photography breaks out of that alignment where the current composition calls for it. At viewport widths of 1700px and above, the site is centered within a maximum width of (1920px). The header is (96px) high on desktop and (80px) at 700px and below.

Desktop stories form an asymmetric two-column spread (1.04fr / 0.8fr), with an (11vw) gap and a (190px) vertical offset on the second story. At 1100px and below the gap becomes (7vw) and the offset becomes (120px). At 700px and below stories become staggered blocks at (88%) width, with a (44px) offset and (3:4) photographs. Desktop story portraits use (4:5). Preserve this editorial rhythm rather than equalizing every photograph into cards.

The horizontal contact sheet uses (285px) figures, alternating vertical offsets of (48px), and proximity scroll snapping. Mobile figures use (72vw), with a (36px) alternating offset. It remains horizontally scrollable by touch, keyboard and the visible directional buttons.

The hero uses the supplied MIRIELLE-50 portrait as its primary photographic field. On desktop the portrait occupies the right side while layered directional gradients carry the warm paper behind the wordmark. At 700px and below it becomes a full-width vertical photograph between the hero copy and metadata, with top and bottom fades joining it to the page surface.

Coverage and about content collapse to a single column on mobile. Film imagery becomes edge-to-edge, with the caption moved toward the bottom and a vertical scrim. The viewer uses the safe viewport height and contains the full photograph without cropping.

## Elevation & Depth

The gallery is predominantly flat. Tonal surfaces, hairline dividers, photographic cropping and open space provide hierarchy. Do not add shadowed card containers to the editorial spreads.

The mobile menu has a restrained separation shadow (`0 15px 25px #1111110a`). The hero portrait uses layered paper-to-transparent gradients to protect the wordmark and connect the photograph to the page without a visible panel edge. Photo captions use soft text shadows only where needed over imagery. Film scrims protect readability: a horizontal black-to-transparent gradient on desktop becomes vertical on mobile. Full values and motion timings live in `.impeccable/design.json`.

**The Flat Gallery Rule.** Keep photographic surfaces flat; use gradients only for photographic blending and readability.

## Shapes

Photographs, editorial regions and viewer surfaces keep straight edges. Circular geometry identifies compact controls: previous/next, close, back-to-top and film actions. Circular icon controls are (46px) square, and the back-to-top control is (44px). Film controls are (60px), becoming (52px) on mobile.

Use thin rules for division and underlining for text actions. Avoid introducing pill-shaped inquiry buttons or rounded image cards. There is no general rounded-panel component in the current system.

## Components

### Text actions and inquiry links

Underlined text and a directional icon provide the primary action language. General text links have a minimum height of (44px), `spacing.text-link-gap` between content and icon, and a (1px) current-color underline. Their icon shifts (3px, -3px) on hover over (0.25s). The larger closing inquiry uses a (5px, -5px) icon shift over (0.3s).

All inquiry calls to action read **Message Us** and point to `https://www.facebook.com/xrishcreatives`. Links opening a new tab carry `rel="noopener noreferrer"`. Film exploration is a content link with its own explicit Facebook label, not an inquiry form.

### Icon buttons

Circular controls are transparent at rest and gain a current-color (10%) transparent mix on hover, over (0.2s). Icons use (1.5) stroke width. Give icon-only controls an accessible name. Disabled buttons use (0.45) opacity and a not-allowed cursor. All keyboard-focusable actions use a (2px) current-color outline with a (6px) offset.

### Navigation

The wordmark is a two-line typographic mark. Desktop navigation provides Work, Films and About, with a separate Message Us link. Mobile keeps Message Us visible and replaces the middle navigation with a (44px) menu toggle. Its expanded panel uses large ruled links; selecting a link closes the panel, and Escape closes it and restores focus to the toggle. Keep the header in normal page flow, as implemented.

### Story photographs and contact sheet

Story photographs are buttons with explicit View labels, rather than decorative cards. Hover scales the image to (1.025) over (0.75s); the small View story action appears on hover or keyboard focus. It stays visible on mobile. The reusable Photo component uses responsive `sizes`, a blur placeholder, meaningful alternative text and an unavailable-image fallback. Gallery images crop with `cover`; the viewer uses `contain` to show the complete frame.

### Films

Use the dark surface and pale type for the Full Pre-debut Film feature. The supplied photograph is a poster for a clearly labelled Coming soon placeholder, not a playable film. When the owner provides a Cloudflare Stream video UID and customer code, replace the placeholder action with Watch full film and open the Stream player on demand in the existing viewer. Do not autoplay. Keep the poster visible as the underlying composition while playback is unavailable.

Two owner-supplied reels play directly in the Films section using responsive Facebook iframes. Omit the other three because Facebook denies embedding them; every displayed short film must be playable. Keep the Cloudflare full-film placeholder separate from these existing short reels.

### Testimonials

Use an asymmetric editorial grid on warm paper for the three screenshot-supplied client messages. The longer Lara note occupies the larger column on desktop; all three stack in reading order on mobile. Preserve the clients' own wording and names. Do not reproduce unsupported ratings or avatars from the screenshots.

### Viewer

The photograph viewer is a native modal dialog with a full dark canvas, title, close action, photograph count and directional controls. Opening it locks body scrolling; closing it restores previous focus. Escape closes it, and arrow keys move through photographs. The photo changes with a short (0.16s) opacity transition. Reduced-motion mode suppresses that opacity change. Retain the readable title and visible controls on mobile.

### Photographic hero

The owner-supplied MIRIELLE-50 portrait replaces the former 3D camera. It uses the same high-resolution responsive image pipeline as the portfolio and receives a restrained vertical scroll drift through Motion. Reduced-motion mode removes the drift. Gradients blend the image into the paper surface without lowering the photograph's delivered resolution.

## Do's and Don'ts

### Do:

- **Do** preserve XRISH CREATIVES as the exact hero headline.
- **Do** keep inquiry labels as Message Us and point them to the confirmed Facebook page.
- **Do** use actual supplied photography with accurate alternative text and responsive image sizing.
- **Do** preserve warm neutral surfaces, straight image edges and staggered editorial spacing.
- **Do** keep visible keyboard focus, minimum 44px controls and reduced-motion alternatives.
- **Do** preserve the MIRIELLE-50 portrait as the hero image and keep its face and dress visible at each breakpoint.

### Don't:

- **Don't** substitute generic rounded card grids for the photographic spreads.
- **Don't** introduce decorative interface colors that compete with the photographs.
- **Don't** invent testimonials, awards, statistics, client identities, dates or locations beyond the owner-supplied Laguna location and named client feedback.
- **Don't** make mobile interactions depend on hover or hide the only path to an action.
- **Don't** autoplay audio or hijack scrolling.
- **Don't** present a photograph as a working embedded film before an actual film asset is supplied.
