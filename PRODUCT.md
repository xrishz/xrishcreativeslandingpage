# XRISH CREATIVES

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
Next.js App Router, React, TypeScript, Tailwind CSS and Motion. User confirmed building the working site directly.

## Users
People and organizations in the Philippines choosing photo and video coverage for exactly five event categories: Debut, Predebut, Weddings, Corporate Events, and Graduations. The user explicitly narrowed the scope to these categories; do not add others.

## Product Purpose
Show XRISH's real work, create interest, and turn that interest into a conversation. The portfolio is the primary evidence.

## Positioning
XRISH CREATIVES is an event photography and film team based in Laguna, Philippines, led by Elrish John Rull. This is a portfolio experience, not a services catalogue or software landing page.

## Operating Context
Visitors explore photos, inspect stories, watch directly playable event films, read three client testimonials, discover event coverage, and contact the business on Facebook. The site now includes dedicated Our Works and The XRISH Experience routes in addition to the homepage.

## Capabilities and Constraints
Cloudflare Stream is active for four short portfolio films and seven corporate/graduation films. The Films section still includes a Full Pre-debut Film placeholder, visibly Coming soon until the owner supplies an approved full film. Cloudflare Images serves 26 portfolio photographs and 11 film posters, with responsive quality-90 variants and local files retained as fallbacks.

Earlier supplied Facebook references included five public reels for Predebut, Graduation and Debut. Only Mirielle and Angel permitted iframe playback in that earlier review; blocked reel references were omitted. The current curated sequence uses four approved local native films instead. The automatic Facebook feature remains separate and checks candidate public embed responses, which cannot guarantee future eligibility after caching. The Cloudflare full-film placeholder is also separate. Three named client testimonials were supplied as screenshots; preserve their attribution and intended meaning without inventing ratings or additional claims. The approved proofreading includes a compact, single-paragraph Lara note.

The curated homepage and `/works` short films are Mirielle, Angel, Janelle and Khatrina. They use Cloudflare Stream adaptive playback with local H.264/AAC fallback. Muted previews pause offscreen; Watch the film restarts from zero, unmutes and exposes native timeline, seek, volume and fullscreen controls. Shared sound coordination keeps one native source audible. Reduced motion begins paused. Browser download controls and context menus are deterred where supported; this is not DRM and cannot prevent retrieving or recording a public video. A separate **Latest from XRISH** feature reads up to 20 recent managed Page posts through the server-side Meta Graph API, explicitly excludes the original Mirielle and Angel reel IDs, checks up to eight remaining video candidates against Facebook’s public embedded player, and selects the newest candidate whose response contains playable video data. It never exposes the server credential and falls back to the Page link when the API is unavailable, candidates are blocked from embedding, or no different qualifying video is found. Results are cached and fetched once per component mount, not continuously pushed to open pages. Automatic content must not overwrite or repeat the curated film choices.

The recorded Meta production configuration uses Graph API v26.0 and XRISH CREATIVES Page ID 113391138358438. Its system user has Page Insights-only access and app Test access, with `pages_show_list` and `pages_read_engagement` permissions. The permanent system-user credential is stored as a server-only Netlify secret; the route resolves an assigned Page token through `/me/accounts` when Meta requires one. Configuration alone is not evidence of a successful production fetch or of a selected post’s playback eligibility.

The Our Works page contains Debuts, Predebuts, Corporate Events, and Graduation. Debut has an honest film-in-preparation note and a path to real celebration photographs; the owner clarified that Angel and Janelle are predebuts. All four approved short films appear in Predebuts. Four Corporate Events and three Graduation films use Cloudflare Stream; muted eight-second previews loop in black and white, then the color player loads when selected. Graduation uses a two-column desktop grid and one column on mobile. The Drive IDs remain as source references, never public players.

The XRISH Experience page identifies the studio's specialization as Event Coverage and preserves the supplied 2023 origin story. The phrase “fun and chill, parang laro lang” applies only to debut coverage.

All inquiry calls to action say Message Us and link to https://www.facebook.com/xrishcreatives, explicitly confirmed by the user. No inquiry backend or booking availability claims. Source code must be saved in E:\______XRISH CREATIVES SITE and pushed to xrishz/xrishcreativeslandingpage. Reduced motion, touch and keyboard paths are required.

## Brand Commitments
The hero headline is exactly XRISH CREATIVES. A first-session paper/ink wordmark loader opens into a full-viewport muted native film. Each full refresh chooses among all four approved films and avoids the previous choice when session storage is available. The visual direction is the XRISH cinematic screening room: film-forward restraint inspired by Studio Yanagi, expressed through XRISH work and identity.

Editorial, cinematic, warm gallery white and near-black. Photography supplies the color. No generic cards, stock wedding-only identity, fictional testimonials, awards, statistics, dates or locations. Laguna is explicitly supplied by the owner. Minimal, premium, human copy. User's detailed supplied brief is the visual authority.

## Evidence on Hand
26 owner-supplied JPEG photographs are preserved in local ASSETS, including the MIRIELLE-50 portrait, STN07143 landscape, and Cherrielle collection. Four approved short films, seven corporate/graduation films from Drive, and three named client testimonials were supplied. The videos are now on Cloudflare Stream; portfolio photos and posters are on Cloudflare Images. No team portrait or full predebut film was supplied. Use descriptive editorial collection titles rather than inventing client identities, ages, or occasions.

## Product Principles
Four approved short films and seven event films are Stream-backed; local short-film files and poster/preview assets ship as fallbacks.

The opening film is the first proof; the wider portfolio carries the story. Selected Stories rotates three landscape photographs, including owner-supplied STN07143, with a visible count and Pause/Resume control. Hover and focus pause it, and reduced motion keeps it static. The fine-pointer camera cursor uses a glow attached to the cursor disc; there is no separate trailing effect. The lead film sits left of a concise story on desktop; film titles align below videos without category labels. Testimonials use bordered horizontal cards with matched typography and a compact fixed height. The latest Facebook feature shows a trusted post preview image and the complete title before the first pipe character. The 1200 × 630 Open Graph/Messenger image captures the branded hero. Show work before services. Keep the route to Facebook clear. Preserve original assets. Design a distinct touch experience.

## Accessibility & Inclusion
Semantic landmarks, accurate alternative text, keyboard navigation, visible focus, focus-managed viewers, Escape close, minimum 44px controls, reduced-motion and static fallback behavior.
