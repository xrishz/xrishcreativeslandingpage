import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { streamPlayerUrl } from "../src/lib/stream";
import {
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

test("Stream placeholder makes no Stream request and lists only the five events", async ({
  page,
}) => {
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("cloudflarestream.com"))
      videoRequests.push(request.url());
  });
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
  await expect(
    page.getByRole("heading", { name: "Full Pre-debut Film" }),
  ).toBeVisible();
  await expect(page.getByText("Coming soon.", { exact: true })).toBeVisible();
  await expect(page.locator(".cinematic-film video")).toHaveCount(4);
  await expect(page.locator(".reel-frame iframe")).toHaveCount(0);
  await expect(page.locator(".latest-facebook-film")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Play A fresh XRISH film. on this page" }),
  ).toBeVisible();
  await expect(page.locator(".latest-facebook-preview")).toHaveCSS(
    "background-image",
    /xrish-preview\.jpg/,
  );
  await page
    .getByRole("button", { name: "Play A fresh XRISH film. on this page" })
    .click();
  await expect(
    page.getByTitle("A fresh XRISH film. — latest XRISH Facebook film"),
  ).toHaveAttribute("src", /plugins\/video\.php.*123456789/);
  expect(videoRequests).toEqual([]);
  await expect(page.locator(".event-list a")).toHaveText([
    "Debut",
    "Predebut",
    "Weddings",
    "Corporate Events",
    "Graduations",
  ]);
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

test("client notes and all four native films appear directly on the page", async ({
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
  await expect(page.locator(".cinematic-film video")).toHaveCount(4);
  for (const film of ["mirielle", "angel", "janelle", "khatrina"])
    await expect(page.locator(`video[data-film-src="/films/${film}.mp4"]`)).toHaveCount(1);
  const mirielle = page.locator('video[data-film-src="/films/mirielle.mp4"]');
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
  const angel = page.locator('video[data-film-src="/films/angel.mp4"]');
  await page.getByRole("button", { name: "Watch Angel from the beginning" }).click();
  await expect.poll(() => mirielle.evaluate((node) => (node as HTMLVideoElement).muted)).toBe(true);
  await mirielle.evaluate((node) => {
    const video = node as HTMLVideoElement;
    video.muted = false;
    video.dispatchEvent(new Event("volumechange"));
  });
  await expect.poll(() => angel.evaluate((node) => (node as HTMLVideoElement).muted)).toBe(true);
  await page.getByRole("button", { name: "Pause Janelle" }).click();
  await expect(page.getByRole("button", { name: "Play Janelle" })).toBeVisible();
  await expect(page.getByText("PUP Sto. Tomas — 30th Commencement Exercises")).toHaveCount(0);
  await expect(page.getByText("Cherreille — Debut Same Day Edit")).toHaveCount(0);
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

test("all inquiry links use the confirmed Facebook destination", async ({
  page,
}) => {
  await page.goto("/");
  const links = page.getByRole("link", { name: "Message Us" });
  await expect(links).toHaveCount(4);
  for (const link of await links.all())
    await expect(link).toHaveAttribute(
      "href",
      "https://www.facebook.com/xrishcreatives",
    );
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
  const firstHeroSource = await page.locator(".hero-film video").getAttribute("src");
  expect(approvedHeroSources).toContain(firstHeroSource);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect.poll(
    () => page.locator(".hero-film video").getAttribute("src"),
  ).not.toBe(firstHeroSource);
  const nextHeroSource = await page.locator(".hero-film video").getAttribute("src");
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
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(page).toHaveURL(/\/works$/);
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
  await page.goto("/");
  await page.getByRole("button", { name: "Scroll photographs right" }).click();
  await expect
    .poll(() => page.locator(".photo-strip").evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(100);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
});

test("The XRISH Experience presents Event Coverage and limits the casual shoot language to debuts", async ({
  page,
}) => {
  await page.goto("/experience");
  await expect(
    page.getByRole("heading", { level: 1, name: "THE XRISH EXPERIENCE" }),
  ).toBeVisible();
  await expect(page.getByText("Event Coverage", { exact: true })).toBeVisible();
  await expect(
    page.getByText(/For debut coverage, shooting with us feels fun and chill/),
  ).toBeVisible();
  await expect(
    page.getByText("Debut coverage feels fun and chill, parang laro lang."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Experience", exact: true }).first(),
  ).toHaveAttribute("aria-current", "page");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
});

test("Our Works presents all four supplied films as native players", async ({
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
  await expect(page.locator(".works-native-films .cinematic-film")).toHaveCount(4);
  await expect(page.locator(".works-film iframe")).toHaveCount(0);
  for (const title of filmTitles)
    await expect(page.getByText(title, { exact: true })).toBeVisible();
  await expect(page.locator('.works-film iframe[src*="drive.google.com"]')).toHaveCount(0);
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
  await expect(graduationGrid.getByText("Film in preparation.")).toBeVisible();
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
