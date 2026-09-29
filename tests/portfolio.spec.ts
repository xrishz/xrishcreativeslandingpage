import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { streamPlayerUrl } from "../src/lib/stream";
import {
  facebookEmbedPreview,
  findLatestFacebookVideo,
  isCuratedFacebookFilm,
} from "../src/lib/facebook";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    window.sessionStorage.setItem("xrish-intro-seen", "true"),
  );
  // Keep tests deterministic; real Facebook playback is verified in the live browser.
  await page.route("https://www.facebook.com/plugins/video.php**", (route) =>
    route.abort(),
  );
  await page.route("https://drive.google.com/file/d/**/preview", (route) =>
    route.abort(),
  );
  await page.route("**/api/facebook/latest-video", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        status: "ready",
        video: {
          id: "post-1",
          title: "A fresh XRISH film.",
          excerpt: "A new celebration from the XRISH page.",
          createdTime: "2026-09-23T01:00:00+0000",
          permalinkUrl: "https://www.facebook.com/xrishcreatives/videos/123456789",
          previewUrl: "https://scontent.fmnl1-1.fna.fbcdn.net/xrish-preview.jpg",
        },
      }),
    }),
  );
});

test("the XRISH loader appears once per browser session", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.sessionStorage.removeItem("xrish-intro-seen"));
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByRole("status", { name: "XRISH CREATIVES is loading" })).toBeVisible();
  await expect(page.getByRole("status", { name: "XRISH CREATIVES is loading" })).toHaveCount(0, {
    timeout: 3000,
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByRole("status", { name: "XRISH CREATIVES is loading" })).toHaveCount(0);
});

test("the decorative loader never blocks the portfolio without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    baseURL: "http://localhost:3000",
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".intro-loader")).toBeHidden();
  await expect(page.getByRole("heading", { level: 1, name: "XRISH CREATIVES" })).toBeVisible();
  await context.close();
});

test("the decorative loader clears when session storage is unavailable", async ({
  browser,
}) => {
  const context = await browser.newContext({ baseURL: "http://localhost:3000" });
  await context.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", {
      configurable: true,
      get() {
        throw new DOMException("Storage is disabled", "SecurityError");
      },
    });
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".intro-loader")).toHaveCount(0, { timeout: 2000 });
  await expect(page.getByRole("heading", { level: 1, name: "XRISH CREATIVES" })).toBeVisible();
  await context.close();
});

test("Angel's SDE replaces the pending feature and lists only available film categories", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".camera-cursor").waitFor({ state: "attached" });
  await page.mouse.move(180, 160);
  await expect(page.locator(".camera-cursor[data-visible='true']")).toBeVisible();
  await expect(page.locator(".camera-cursor-mark")).toHaveCount(1);
  await expect(page.locator(".camera-cursor-trail")).toHaveCount(0);
  const pause = page.getByRole("button", {
    name: "Pause landscape rotation",
  });
  await pause.scrollIntoViewIfNeeded();
  await page.waitForTimeout(650);
  const pauseBox = await pause.boundingBox();
  expect(pauseBox).not.toBeNull();
  const buttonX = pauseBox!.x + pauseBox!.width / 2;
  const buttonY = pauseBox!.y + pauseBox!.height / 2;
  await page.mouse.move(buttonX - 2, buttonY - 2);
  await page.mouse.move(buttonX, buttonY);
  await expect(page.locator(".camera-cursor[data-interactive='true']")).toBeVisible();
  const cursorBeforeHoverTransition = await page.locator(".camera-cursor-mark").boundingBox();
  await page.waitForTimeout(220);
  const cursorAfterHoverTransition = await page.locator(".camera-cursor-mark").boundingBox();
  expect(cursorBeforeHoverTransition).not.toBeNull();
  expect(cursorAfterHoverTransition).not.toBeNull();
  expect(Math.abs(
    cursorAfterHoverTransition!.x + cursorAfterHoverTransition!.width / 2 - buttonX,
  )).toBeLessThan(1);
  expect(Math.abs(
    cursorAfterHoverTransition!.y + cursorAfterHoverTransition!.height / 2 - buttonY,
  )).toBeLessThan(1);
  expect(Math.abs(cursorAfterHoverTransition!.x - cursorBeforeHoverTransition!.x)).toBeLessThan(1);
  expect(Math.abs(cursorAfterHoverTransition!.y - cursorBeforeHoverTransition!.y)).toBeLessThan(1);
  await pause.click();
  await expect(
    page.getByRole("button", { name: "Resume landscape rotation" }),
  ).toHaveAttribute("aria-pressed", "true");
  const pausedFrame = await page
    .locator(".lead-rotation-frame")
    .last()
    .getAttribute("data-frame");
  await page.waitForTimeout(5200);
  await expect(
    page.locator(".lead-rotation-frame").last(),
  ).toHaveAttribute("data-frame", pausedFrame ?? "");
  await expect(page.getByRole("heading", { name: "Angel - Debut SDE" })).toBeVisible();
  await expect(page.getByText("Full Pre-debut Film", { exact: true })).toHaveCount(0);
  await expect(page.locator(".cinematic-film video")).toHaveCount(5);
  await expect(page.locator(".reel-frame iframe")).toHaveCount(0);
  await expect(page.locator(".latest-facebook-film")).toHaveCount(1);
  await expect(
    page.getByTitle("A fresh XRISH film: latest XRISH Facebook film"),
  ).toHaveAttribute("src", /plugins\/video\.php.*123456789/);
  await expect(page.locator(".latest-facebook-launch")).toHaveCount(0);
  await expect(page.locator(".event-list a")).toHaveText([
    "Debut",
    "Predebut",
    "Corporate Events",
    "Graduations",
  ]);
});

test("a mirrored Facebook film plays inline on mobile with one site-level tap", async ({ page }) => {
  await page.route("**/api/facebook/latest-video", (route) => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({
      status: "ready",
      video: {
        id: "113391138358438_1043239105382917",
        title: "PUP Sto. Tomas",
        permalinkUrl: "https://www.facebook.com/reel/1833990724442309/",
      },
    }),
  }));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const latest = page.locator(".latest-facebook-film");
  await expect(latest.locator("iframe")).toHaveCount(0);
  const player = latest.locator("video.works-film-player");
  await expect(player).toHaveAttribute("playsinline", "");
  await latest.getByRole("button", { name: "Play PUP Sto. Tomas" }).click();
  await expect(latest.locator(".works-film-stage")).toHaveAttribute("data-started", "true");
});

test("the latest film stays clear of its title across two-column widths", async ({ page }) => {
  await page.route("**/api/facebook/latest-video", (route) => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({
      status: "ready",
      video: {
        id: "113391138358438_1043239105382917",
        title: "PUP Sto. Tomas Campus - 31st Commencement Exercises",
        permalinkUrl: "https://www.facebook.com/reel/1833990724442309/",
      },
    }),
  }));

  for (const width of [792, 1024, 1440, 2294]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    const film = page.locator(".latest-facebook-film");
    await expect(film.locator(".works-film-stage")).toBeVisible();
    const frame = await film.locator(".latest-facebook-frame").boundingBox();
    const stage = await film.locator(".works-film-stage").boundingBox();
    const copy = await film.locator(".latest-facebook-copy").boundingBox();
    expect(frame && stage && copy).toBeTruthy();
    expect(frame!.x + frame!.width + 20).toBeLessThan(copy!.x);
    expect(stage!.x + stage!.width + 20).toBeLessThan(copy!.x);
    await expect(film.locator(".works-film figcaption")).toBeHidden();
  }
});

test("selected stories can be rearranged on desktop while mobile keeps its layout", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const cards = page.locator(".story-spread .story");
  await cards.first().scrollIntoViewIfNeeded();
  const original = await cards.locator("h3").allTextContents();
  await cards.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(cards.nth(1).locator("h3")).toHaveText(original[0]);
  await page.waitForTimeout(700);
  const from = await cards.nth(1).locator(".story-image").boundingBox();
  const to = await cards.nth(2).locator(".story-image").boundingBox();
  expect(from && to).toBeTruthy();
  await page.mouse.move(from!.x + from!.width / 2, from!.y + from!.height / 2);
  await page.mouse.down();
  await page.mouse.move(to!.x + to!.width / 2, to!.y + to!.height / 2, { steps: 24 });
  await page.mouse.up();
  await expect(cards.nth(2).locator("h3")).toHaveText(original[0]);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(cards.first()).toHaveAttribute("tabindex", "-1");
  await page.waitForTimeout(300);
  await cards.first().getByRole("button", { name: /^View / }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("latest Facebook selector skips non-video posts and unsafe URLs", () => {
  expect(
    findLatestFacebookVideo([
      {
        id: "photo",
        permalink_url: "https://www.facebook.com/xrishcreatives/posts/1",
        attachments: { data: [{ media_type: "photo" }] },
      },
      {
        id: "unsafe",
        permalink_url: "https://example.com/video/2",
        attachments: { data: [{ media_type: "video" }] },
      },
      {
        id: "video",
        message: "PUP STO. TOMAS | 31ST COMMENCEMENT EXERCISES SDE. More from the celebration.",
        created_time: "2026-09-23T01:00:00+0000",
        full_picture: "https://scontent.fmnl1-1.fna.fbcdn.net/xrish-preview.jpg",
        permalink_url:
          "https://www.facebook.com/xrishcreatives/videos/123456789",
        attachments: { data: [{ media_type: "video" }] },
      },
    ]),
  ).toEqual({
    id: "video",
    title: "PUP STO. TOMAS",
    excerpt: "PUP STO. TOMAS | 31ST COMMENCEMENT EXERCISES SDE. More from the celebration.",
    createdTime: "2026-09-23T01:00:00+0000",
    permalinkUrl: "https://www.facebook.com/xrishcreatives/videos/123456789",
    previewUrl: "https://scontent.fmnl1-1.fna.fbcdn.net/xrish-preview.jpg",
  });

  expect(
    isCuratedFacebookFilm({
      id: "mirielle",
      title: "Mirielle",
      permalinkUrl: "https://www.facebook.com/reel/1032666439513604/",
    }),
  ).toBe(true);
  expect(
    isCuratedFacebookFilm({
      id: "angel",
      title: "Angel",
      permalinkUrl: "https://www.facebook.com/reel/4579322825726121/",
    }),
  ).toBe(true);
  expect(
    isCuratedFacebookFilm({
      id: "different",
      title: "Different film",
      permalinkUrl: "https://www.facebook.com/reel/123456789/",
    }),
  ).toBe(false);
});

test("Facebook film preview uses the playable embed's trusted image", () => {
  const embed = (src: string) =>
    `<video height="314" width="560"></video><div><img src="${src}" alt="" /></div>`;
  expect(
    facebookEmbedPreview(
      embed("https://scontent.fmnl1-1.fna.fbcdn.net/film.jpg?a=1&amp;b=2"),
    ),
  ).toBe("https://scontent.fmnl1-1.fna.fbcdn.net/film.jpg?a=1&b=2");
  expect(facebookEmbedPreview(embed("https://example.com/film.jpg"))).toBeUndefined();
  expect(facebookEmbedPreview('<img src="https://example.com/film.jpg" />')).toBeUndefined();
});

test("Stream playback URLs accept only valid public identifiers", () => {
  expect(streamPlayerUrl({ videoId: undefined })).toBeUndefined();
  expect(
    streamPlayerUrl({
      videoId: "invalid",
      customerCode: "sample123",
    }),
  ).toBeUndefined();
  expect(
    streamPlayerUrl({
      videoId: "a".repeat(32),
      customerCode: "sample123",
    }),
  ).toBe(
    `https://customer-sample123.cloudflarestream.com/${"a".repeat(32)}/iframe`,
  );
  expect(
    streamPlayerUrl({
      videoId: "a".repeat(32),
      customerCode: "evil.example/path",
    }),
  ).toBeUndefined();
});

test("client notes, short films, and Angel's debut SDE appear directly on the page", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByText("We’re a photo and video team based in Laguna, Philippines, led by Elrish John Rull.")).toBeVisible();
  await expect(page.locator(".testimonial")).toHaveCount(3);
  for (const name of ["Janelle Angeles", "Cherreille Gonzales", "Lara Jabagat"])
    await expect(page.getByText(name)).toBeVisible();
  const laraNote = page.getByLabel("Client note 3 of 3");
  await expect(laraNote.locator("blockquote p")).toHaveCount(1);
  await expect(laraNote).toContainText("balanced professionalism with humor");
  await page.getByRole("button", { name: "Next client note" }).click();
  await expect(page.getByRole("button", { name: "Show note 2 from Cherreille Gonzales" })).toHaveAttribute("aria-current", "true");
  await page.locator(".testimonial-carousel").press("ArrowRight");
  await expect(page.getByRole("button", { name: "Show note 3 from Lara Jabagat" })).toHaveAttribute("aria-current", "true");
  await expect.poll(() => page.locator(".testimonial-track").evaluate((track) => track.scrollLeft)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Show note 1 from Janelle Angeles" }).click();
  await expect(page.getByRole("button", { name: "Show note 1 from Janelle Angeles" })).toHaveAttribute("aria-current", "true");
  await expect(page.locator(".reel-card")).toHaveCount(0);
  await expect(page.locator(".reel-feature")).toHaveCount(0);
  await expect(page.locator(".reel-frame iframe")).toHaveCount(0);
  await expect(page.locator(".cinematic-film video")).toHaveCount(5);
  for (const film of ["mirielle", "angel", "janelle", "khatrina"])
    await expect(page.locator(`.cinematic-film video[data-film-src="/films/${film}.mp4"]`)).toHaveCount(1);
  await expect(page.locator('.film-feature-sde video[data-film-src="/films/angel-debut-sde-preview.mp4"]')).toHaveCount(1);
  const mirielle = page.locator('.cinematic-film video[data-film-src="/films/mirielle.mp4"]');
  await expect(mirielle).toHaveAttribute("controlslist", /nodownload/);
  await expect(mirielle).toHaveAttribute("disablepictureinpicture", "");
  await expect(mirielle).toHaveAttribute("disableremoteplayback", "");
  expect(await mirielle.evaluate((node) => node.dispatchEvent(
    new MouseEvent("contextmenu", { bubbles: true, cancelable: true }),
  ))).toBe(false);
  await expect(page.getByRole("button", { name: "Watch Mirielle from the beginning" })).toBeVisible();
  await page.getByRole("button", { name: "Watch Mirielle from the beginning" }).click();
  await expect(mirielle).toHaveAttribute("controls", "");
  await expect.poll(() => mirielle.evaluate((node) => {
    const video = node as HTMLVideoElement;
    return { muted: video.muted, time: video.currentTime };
  })).toMatchObject({ muted: false });
  const angel = page.locator('.cinematic-film video[data-film-src="/films/angel.mp4"]');
  await page.getByRole("button", { name: "Watch Angel from the beginning" }).click();
  await expect(angel).toHaveAttribute("controls", "");
  await expect.poll(() => angel.evaluate((node) => (node as HTMLVideoElement).muted)).toBe(false);
  await expect.poll(() => angel.evaluate((node) => (node as HTMLVideoElement).currentTime), { timeout: 30000 }).toBeGreaterThan(0);
  await expect.poll(() => mirielle.evaluate((node) => (node as HTMLVideoElement).muted)).toBe(true);
  await mirielle.evaluate((node) => {
    const video = node as HTMLVideoElement;
    video.muted = false;
    video.dispatchEvent(new Event("volumechange"));
  });
  await expect.poll(() => angel.evaluate((node) => (node as HTMLVideoElement).muted)).toBe(true);
  await expect(page.locator(".cinematic-film-janelle .cinematic-stage")).toHaveAttribute("data-inactive", "true");
  await expect.poll(() => page.locator(".cinematic-film-janelle video").evaluate((node) => (node as HTMLVideoElement).paused)).toBe(true);
  await angel.evaluate((node) => (node as HTMLVideoElement).pause());
  await expect(page.locator(".cinematic-film-janelle .cinematic-stage")).toHaveAttribute("data-inactive", "false");
  await expect(page.getByText("PUP Sto. Tomas - 30th Commencement Exercises")).toHaveCount(0);
  await expect(page.getByText("Cherreille - Debut Same Day Edit")).toHaveCount(0);
});

test("homepage exposes the branded hero preview to Messenger and social crawlers", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/opengraph-image\.jpg/,
  );
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    "content",
    /hero page preview/,
  );
});

test("Selected Stories rotates between landscape photographs without separating the cursor", async ({
  page,
}) => {
  await page.goto("/");
  const leadFrame = page.locator(".lead-rotation-frame").last();
  const lead = leadFrame.locator("img");
  await expect(lead).toBeVisible();
  const firstSource = await leadFrame.getAttribute("data-frame");
  expect(firstSource).toBeTruthy();
  await expect
    .poll(
      () =>
        page
          .locator(".lead-rotation-frame")
          .last()
          .getAttribute("data-frame"),
      { timeout: 7000 },
    )
    .not.toBe(firstSource);
  await expect
    .poll(() =>
      page
        .locator(".lead-rotation-frame")
        .last()
        .locator("img")
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  const currentLead = page
    .locator(".lead-rotation-frame")
    .last()
    .locator("img");
  const dimensions = await currentLead.evaluate((image: HTMLImageElement) => ({
    width: image.naturalWidth,
    height: image.naturalHeight,
  }));
  expect(dimensions.width).toBeGreaterThan(dimensions.height);
  await page.mouse.move(400, 650);
  await expect(page.locator(".camera-cursor-mark")).toHaveCount(1);
  await expect(page.locator(".camera-cursor-trail")).toHaveCount(0);
});

test("real gallery opens, changes photographs, traps focus and restores it", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "View In full bloom." });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByText("01 / 04")).toBeVisible();
  await page.getByRole("button", { name: "Next photograph" }).click();
  await expect(page.getByRole("dialog").getByText("02 / 04")).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("dialog").getByText("01 / 04")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("booking links open Messenger and the homepage answers key questions", async ({
  page,
}) => {
  await page.goto("/");
  const links = page.getByRole("link", { name: "Message Us" });
  expect(await links.count()).toBeGreaterThanOrEqual(4);
  for (const link of await links.all())
    await expect(link).toHaveAttribute(
      "href",
      "https://m.me/xrishcreatives",
    );
  await expect(page.locator(".desktop-nav a")).toHaveText(["Home", "Works", "About"]);
  await expect(page.locator(".faq-preview .faq-item")).toHaveCount(3);
  await page.locator(".faq-preview summary").first().click();
  await expect(page.locator(".faq-preview .faq-item").first()).toHaveAttribute("open", "");
  await expect(page.locator(".faq-preview")).toContainText("₱2,000");
  await expect(page.locator(".faq-preview .faq-item p a").first()).toHaveAttribute("href", "https://m.me/xrishcreatives");
  await expect(page.locator(".faq-preview .faq-item p a").first()).toHaveAttribute("target", "_blank");
  await expect(page.getByText("Check Your Date")).toHaveCount(0);
});

test("hero film, mobile navigation, contact sheet and narrow layout remain usable", async ({
  page,
}) => {
  const modelRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes(".glb")) modelRequests.push(request.url());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".hero-film")).toBeVisible();
  const approvedHeroSources = [
    "/films/mirielle.mp4",
    "/films/angel.mp4",
    "/films/janelle.mp4",
    "/films/khatrina.mp4",
  ];
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("xrish-last-hero-film"))).not.toBeNull();
  const firstHeroIndex = await page.evaluate(() => sessionStorage.getItem("xrish-last-hero-film"));
  await expect(page.locator(".hero-film video")).toHaveAttribute("data-film-src", approvedHeroSources[Number(firstHeroIndex)]);
  const firstHeroSource = await page.locator(".hero-film video").getAttribute("data-film-src");
  expect(approvedHeroSources).toContain(firstHeroSource);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("xrish-last-hero-film"))).not.toBe(firstHeroIndex);
  await expect.poll(
    () => page.locator(".hero-film video").getAttribute("data-film-src"),
  ).not.toBe(firstHeroSource);
  const nextHeroSource = await page.locator(".hero-film video").getAttribute("data-film-src");
  expect(approvedHeroSources).toContain(nextHeroSource);
  await expect(page.getByRole("button", { name: "Pause hero film" })).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(modelRequests).toEqual([]);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Works", exact: true })
    .click();
  await expect(page).toHaveURL(/\/works$/);
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
  await page.goto("/");
  const photoStrip = page.locator(".photo-strip");
  await photoStrip.scrollIntoViewIfNeeded();
  await photoStrip.hover();
  const start = await photoStrip.evaluate((el) => el.scrollLeft);
  await expect
    .poll(() => photoStrip.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(start + 30);
  await expect(page.getByRole("button", { name: /photo carousel|Scroll photographs/ })).toHaveCount(0);
  await photoStrip.focus();
  const beforeKey = await photoStrip.evaluate((el) => el.scrollLeft);
  await photoStrip.press("ArrowRight");
  await expect
    .poll(() => photoStrip.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(beforeKey + 100);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
});

test("About combines the team story and the XRISH experience", async ({
  page,
}) => {
  await page.goto("/about");
  await expect(
    page.getByRole("heading", { level: 1, name: "ABOUT XRISH" }),
  ).toBeVisible();
  await expect(page.getByText(/photo and video team based in Laguna/)).toBeVisible();
  await expect(
    page.getByText(/For debuts, the shoot feels fun and chill/),
  ).toBeVisible();
  await expect(
    page.getByText("Debut coverage feels fun and chill, parang laro lang."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "About", exact: true }).first(),
  ).toHaveAttribute("aria-current", "page");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
});

test("the full FAQ explains the booking terms and the former Experience URL leads to About", async ({ page }) => {
  await page.goto("/faq");
  await expect(page.getByRole("heading", { level: 1, name: "Good questions. Clear answers." })).toBeVisible();
  await expect(page.locator(".faq-page .faq-item")).toHaveCount(10);
  await page.locator(".faq-page summary").first().click();
  await expect(page.locator(".faq-page .faq-item").first()).toContainText("confirm your booking in writing");
  await page.locator(".faq-page summary").nth(1).click();
  await expect(page.locator(".faq-page .faq-item").first()).not.toHaveAttribute("open", "");
  await expect(page.locator(".faq-page .faq-item").nth(1)).toHaveAttribute("open", "");
  await expect(page.getByRole("link", { name: "Inquire on Messenger" })).toHaveAttribute("href", "https://m.me/xrishcreatives");
  await expect(page.getByRole("link", { name: "Read the full terms" })).toHaveCount(0);
  await page.goto("/experience");
  await expect(page).toHaveURL(/\/about$/);
});

test("the reaction films give the active video the room and restore both on pause", async ({ page }) => {
  await page.goto("/about");
  const films = page.locator(".experience-reactions-films .cinematic-film");
  const cherrielle = films.nth(0);
  const khatrina = films.nth(1);

  await cherrielle.getByRole("button", { name: /Watch Cherrielle.*from the beginning/ }).click();
  await expect(khatrina.locator(".cinematic-stage")).toHaveAttribute("data-inactive", "true");
  await expect.poll(() => khatrina.locator("video").evaluate((video) => (video as HTMLVideoElement).paused)).toBe(true);
  await expect(khatrina.locator(".cinematic-stage")).toHaveCSS("filter", "grayscale(1)");
  await khatrina.locator("video").evaluate(async (video) => {
    await (video as HTMLVideoElement).play().catch(() => undefined);
  });
  await expect.poll(() => khatrina.locator("video").evaluate((video) => (video as HTMLVideoElement).paused)).toBe(true);

  await expect.poll(() => cherrielle.locator("video").evaluate((video) => (video as HTMLVideoElement).paused), { timeout: 30000 }).toBe(false);
  await expect.poll(() => cherrielle.locator("video").evaluate((video) => (video as HTMLVideoElement).currentTime), { timeout: 30000 }).toBeGreaterThan(0.1);
  await khatrina.getByRole("button", { name: /Watch Khatrina.*from the beginning/ }).click();
  await expect(cherrielle.locator(".cinematic-stage")).toHaveAttribute("data-inactive", "true");
  await expect.poll(() => cherrielle.locator("video").evaluate((video) => (video as HTMLVideoElement).paused)).toBe(true);
  await expect.poll(() => khatrina.locator("video").evaluate((video) => (video as HTMLVideoElement).paused), { timeout: 30000 }).toBe(false);
  const previousTime = await cherrielle.locator("video").evaluate((video) => (video as HTMLVideoElement).currentTime);
  await cherrielle.getByRole("button", { name: /Continue Cherrielle.*from where you left off/ }).click();
  await expect.poll(() => cherrielle.locator("video").evaluate((video) => (video as HTMLVideoElement).paused), { timeout: 30000 }).toBe(false);
  expect(await cherrielle.locator("video").evaluate((video) => (video as HTMLVideoElement).currentTime)).toBeGreaterThanOrEqual(previousTime - 0.1);
  await expect(khatrina.locator(".cinematic-stage")).toHaveAttribute("data-inactive", "true");
  await khatrina.getByRole("button", { name: /Continue Khatrina.*from where you left off/ }).click();
  await expect.poll(() => khatrina.locator("video").evaluate((video) => (video as HTMLVideoElement).paused), { timeout: 30000 }).toBe(false);
  await khatrina.locator("video").evaluate((video) => (video as HTMLVideoElement).pause());
  await expect(khatrina.locator(".cinematic-stage")).toHaveAttribute("data-inactive", "false");
  await expect(cherrielle.locator(".cinematic-stage")).toHaveAttribute("data-inactive", "false");
});

test("Our Works presents predebut films and preloaded corporate and graduation players", async ({
  page,
}) => {
  await page.goto("/works");
  await expect(
    page.getByRole("heading", { level: 1, name: "OUR WORKS" }),
  ).toBeVisible();
  for (const heading of [
    "DEBUTS",
    "PREDEBUTS",
    "CORPORATE EVENTS",
    "GRADUATION",
  ])
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
  const filmTitles = ["Angel", "Janelle", "Mirielle", "Khatrina"];
  await expect(page.locator(".works-native-films .cinematic-film")).toHaveCount(9);
  await expect(page.locator("#debuts .cinematic-film")).toHaveCount(5);
  await expect(page.locator("#predebuts .cinematic-film")).toHaveCount(4);
  await expect(page.locator(".works-film-preview")).toHaveCount(7);
  await expect(page.getByRole("button", { name: /^Play (?:C&E|18th CE-Logic|Nippon|BNI|PUP)/ })).toHaveCount(7);
  await expect(page.locator(".works-film-player")).toHaveCount(7);
  await expect(page.locator(".works-film iframe")).toHaveCount(0);
  for (const title of filmTitles)
    await expect(page.getByText(title, { exact: true })).toBeVisible();
  const firstPreview = page.locator(".works-film-preview").first();
  await firstPreview.scrollIntoViewIfNeeded();
  await expect.poll(() => firstPreview.evaluate((video) => (video as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
  await expect(firstPreview).toHaveCSS("filter", /grayscale\(1\)/);
  await page.getByRole("button", { name: "Play C&E EDConnect 2026" }).click();
  const firstFilm = page.locator(".works-film").first();
  await expect(firstFilm.locator(".works-film-stage")).toHaveAttribute("data-playing", "true", { timeout: 30000 });
  await expect.poll(() => firstFilm.locator(".works-film-player").evaluate((video) => (video as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
  await expect(page.locator('nav[aria-label="Work categories"] a[href*="wedding"]')).toHaveCount(0);
  await expect(page.locator(".works-film-poster")).toHaveCount(7);
  await expect(page.getByText("BNI Hinirang - Chartering & Launch")).toBeVisible();
  await expect(page.getByText("PUP Sto. Tomas Campus - 30th Commencement Exercises")).toBeVisible();
  await expect(page.getByText("PUP Sto. Tomas Campus - 31st Commencement Exercises")).toBeVisible();
  await expect(page.getByText("PUP Sto. Tomas Campus - 31st Recognition Ceremony")).toBeVisible();
  await expect(page.getByText("18th CE-Logic National Conference")).toBeVisible();
  await expect(page.getByText("Nippon Paint Philippines Inc. Paskong Pinoy Christmas Party 2025")).toBeVisible();
  await expect(page.getByText("Angel - Debut SDE")).toBeVisible();
  await expect(page.getByText("Khatrina - Debut SDE")).toBeVisible();
  for (const title of ["Cherrielle - Debut SDE", "Sky - Debut SDE", "Shamia - Debut SDE"])
    await expect(page.getByText(title)).toBeVisible();
  await expect(
    page.locator(
      '.works-page a[href*="drive.google.com"], .works-page a[href*="facebook.com/reel"]',
    ),
  ).toHaveCount(0);
  const graduationGrid = page.locator(".works-film-list-single");
  expect(
    await graduationGrid.evaluate(
      (element) => getComputedStyle(element).gridTemplateColumns.split(" ").length,
    ),
  ).toBe(2);
  await expect(graduationGrid.locator(".works-film")).toHaveCount(3);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await graduationGrid.evaluate(
      (element) => getComputedStyle(element).gridTemplateColumns.split(" ").length,
    ),
  ).toBe(1);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
});

test("the new debut film opens its full Stream playback on the first click", async ({ page }) => {
  test.setTimeout(45000);
  await page.goto("/works");
  const sky = page.locator(".cinematic-film-sky-debut-sde");
  await sky.scrollIntoViewIfNeeded();
  const poster = sky.locator(".cinematic-poster");
  await expect.poll(() => poster.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await sky.getByRole("button", { name: "Watch Sky - Debut SDE from the beginning" }).click();
  const film = sky.locator("video");
  await expect(film).toHaveAttribute("controls", "");
  await expect.poll(() => film.evaluate((video) => (video as HTMLVideoElement).currentTime), { timeout: 30000 }).toBeGreaterThan(0);
});

test("the first visible film play button responds on a fresh page load", async ({ page }) => {
  await page.goto("/works", { waitUntil: "domcontentloaded" });
  const launch = page.getByRole("button", { name: "Play C&E EDConnect 2026" });
  await launch.click();
  const stage = page.locator(".works-film").first().locator(".works-film-stage");
  await expect(stage).toHaveAttribute("data-started", "true");
  await expect(stage).toHaveAttribute("data-playing", "true", { timeout: 30000 });
});

test("corporate and graduation films share one active player and keep their place", async ({ page }) => {
  await page.goto("/works");
  const corporate = page.locator("#corporate-events .works-film");
  const first = corporate.nth(0);
  const second = corporate.nth(1);
  await first.getByRole("button", { name: "Play C&E EDConnect 2026" }).click();
  await expect(first.locator(".works-film-stage")).toHaveAttribute("data-revealed", "true", { timeout: 30000 });
  await expect(second.locator(".works-film-stage")).toHaveAttribute("data-inactive", "true");
  await second.getByRole("button", { name: "Play 18th CE-Logic National Conference" }).click();
  await expect(second.locator(".works-film-stage")).toHaveAttribute("data-revealed", "true", { timeout: 30000 });
  await expect(first.locator(".works-film-stage")).toHaveAttribute("data-inactive", "true");
  await expect.poll(() => first.locator(".works-film-player").evaluate((video) => (video as HTMLVideoElement).paused)).toBe(true);
  const previousTime = await first.locator(".works-film-player").evaluate((video) => (video as HTMLVideoElement).currentTime);
  await first.getByRole("button", { name: "Continue C&E EDConnect 2026 from where you left off" }).click();
  await expect(first.locator(".works-film-stage")).toHaveAttribute("data-playing", "true", { timeout: 30000 });
  expect(await first.locator(".works-film-player").evaluate((video) => (video as HTMLVideoElement).currentTime)).toBeGreaterThanOrEqual(previousTime - 0.1);
  await first.locator(".works-film-player").evaluate((video) => (video as HTMLVideoElement).pause());
  await expect(first.locator(".works-film-stage")).toHaveAttribute("data-inactive", "false");
  await expect(second.locator(".works-film-stage")).toHaveAttribute("data-inactive", "false");
  await expect(corporate.nth(2).locator(".works-film-preview")).toHaveCSS("filter", "none");
  const graduation = page.locator("#graduation .works-film");
  await graduation.nth(0).getByRole("button", { name: "Play PUP Sto. Tomas Campus - 31st Commencement Exercises" }).click();
  await expect(graduation.nth(1).locator(".works-film-stage")).toHaveAttribute("data-inactive", "true");
  await graduation.nth(1).getByRole("button", { name: "Play PUP Sto. Tomas Campus - 31st Recognition Ceremony" }).click();
  await expect(graduation.nth(0).locator(".works-film-stage")).toHaveAttribute("data-inactive", "true");
});

test("reduced motion keeps the photographic hero, work and inquiry available", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator(".camera-cursor").waitFor({ state: "attached" });
  await page.mouse.move(180, 160);
  await expect(page.locator(".camera-cursor[data-visible='true']")).toBeVisible();
  await expect(page.locator(".camera-cursor-trail")).toHaveCount(0);
  await expect(page.locator(".hero-film")).toBeVisible();
  await expect(page.getByRole("button", { name: "Play hero film" })).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("button", { name: "View In full bloom." }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("link", { name: "Message Us" }).first(),
  ).toBeVisible();
});

test("homepage and viewer have no serious or critical automated accessibility findings", async ({
  page,
}) => {
  await page.goto("/");
  const home = await new AxeBuilder({ page }).analyze();
  expect(
    home.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    ),
  ).toEqual([]);
  await page.getByRole("button", { name: "View In full bloom." }).click();
  const viewer = await new AxeBuilder({ page }).analyze();
  expect(
    viewer.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    ),
  ).toEqual([]);
});

test("internal pages use the curtain while hash, modified clicks and history stay native", async ({ page, context }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Works", exact: true }).first().click();
  await expect(page).toHaveURL(/\/works$/);
  await expect(page.locator(".pixel-curtain-mark")).toHaveText("Our Works");
  await expect(page.locator(".pixel-curtain")).toHaveAttribute("data-phase", "idle", { timeout: 3000 });
  await page.getByRole("link", { name: "About", exact: true }).first().click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator(".pixel-curtain-mark")).toHaveText("About XRISH");
  await page.goBack();
  await expect(page).toHaveURL(/\/works$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator(".pixel-curtain")).toHaveAttribute("data-phase", "idle");
  await page.getByRole("link", { name: "XRISH CREATIVES home" }).click();
  await expect(page).toHaveURL(/localhost:3000\/$/);
  const original = page.url();
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("link", { name: "Works", exact: true }).first().click({ modifiers: ["Control"] }),
  ]);
  await newPage.waitForLoadState("domcontentloaded");
  expect(page.url()).toBe(original);
  await newPage.close();
  await page.getByRole("link", { name: "Explore debut films", exact: true }).click();
  await expect(page).toHaveURL(/\/works#debuts$/);
  await expect(page.locator("#debuts").getByRole("heading", { name: "DEBUTS" })).toBeInViewport();
});

test("unmatched URLs show the XRISH 404 with working recovery links", async ({ page }) => {
  const response = await page.goto("/a-missing-frame");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "This frame is missing." })).toBeVisible();
  await page.getByRole("link", { name: "Explore our work" }).click();
  await expect(page).toHaveURL(/\/works$/);
});

test("site-controlled copy and metadata never render an em dash", async ({ page }) => {
  for (const route of ["/", "/works", "/about", "/faq", "/a-missing-frame"]) {
    await page.goto(route);
    const offenders = await page.evaluate(() => {
      const mark = String.fromCharCode(0x2014);
      const text = document.body.innerText.includes(mark);
      const title = document.title.includes(mark);
      const attributes = [...document.querySelectorAll<HTMLElement>("[title], [aria-label], [alt]")]
        .some((element) => ["title", "aria-label", "alt"].some((name) => element.getAttribute(name)?.includes(mark)));
      const metadata = [...document.querySelectorAll<HTMLMetaElement>("meta[content]")].some((element) => element.content.includes(mark));
      return { text, title, attributes, metadata };
    });
    expect(offenders, route).toEqual({ text: false, title: false, attributes: false, metadata: false });
  }
});
