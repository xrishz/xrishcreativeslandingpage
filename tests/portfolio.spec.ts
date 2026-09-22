import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { streamPlayerUrl } from "../src/lib/stream";

test.beforeEach(async ({ page }) => {
  // Keep tests deterministic; real Facebook playback is verified in the live browser.
  await page.route("https://www.facebook.com/plugins/video.php**", (route) =>
    route.abort(),
  );
  await page.route("https://drive.google.com/file/d/**/preview", (route) =>
    route.abort(),
  );
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
  await expect(page.locator(".reel-frame iframe")).toHaveCount(2);
  expect(videoRequests).toEqual([]);
  await expect(page.locator(".event-list a")).toHaveText([
    "Debut",
    "Predebut",
    "Weddings",
    "Corporate Events",
    "Graduations",
  ]);
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

test("client notes and only playable videos appear directly on the page", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByText("We’re a photo and video team based in Laguna, Philippines, led by Elrish John Rull.")).toBeVisible();
  await expect(page.locator(".testimonial")).toHaveCount(3);
  for (const name of ["Janelle Angeles", "Cherreille Gonzales", "Lara Jabagat"])
    await expect(page.getByText(name)).toBeVisible();
  await expect(page.locator(".reel-card")).toHaveCount(0);
  await expect(page.locator(".reel-feature")).toHaveCount(2);
  await expect(page.locator(".reel-frame iframe")).toHaveCount(2);
  await expect(page.getByTitle("Angel — Debut Same Day Edit — Facebook video player")).toHaveAttribute(
    "src",
    /plugins\/video\.php.*4579322825726121/,
  );
  await expect(page.getByTitle("Mirielle — Pre-debut Film — Facebook video player")).toHaveAttribute(
    "src",
    /plugins\/video\.php.*1032666439513604/,
  );
  await expect(page.getByText("Janelle — Pre-debut Film")).toHaveCount(0);
  await expect(page.getByText("PUP Sto. Tomas — 30th Commencement Exercises")).toHaveCount(0);
  await expect(page.getByText("Cherreille — Debut Same Day Edit")).toHaveCount(0);
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

test("hero photograph, mobile navigation, contact sheet and narrow layout remain usable", async ({
  page,
}) => {
  const modelRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes(".glb")) modelRequests.push(request.url());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".hero-portrait")).toBeVisible();
  await expect(page.locator(".hero-portrait img")).toHaveAttribute(
    "src",
    /mirielle-50/,
  );
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

test("Our Works keeps only the two films verified as playable in the site", async ({
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
  const filmTitles = [
    "Angel — Debut Same Day Edit",
    "Mirielle — Pre-debut Film",
  ];
  await expect(page.locator(".works-film-launch")).toHaveCount(2);
  await expect(page.locator(".works-film iframe")).toHaveCount(0);
  for (const title of filmTitles)
    await page
      .getByRole("button", { name: "Play " + title + " on this page" })
      .click();
  await expect(page.locator(".works-film iframe")).toHaveCount(2);
  await expect(
    page.getByTitle("Angel — Debut Same Day Edit — Facebook video player"),
  ).toHaveAttribute("src", /facebook\.com\/plugins\/video\.php/);
  await expect(
    page.getByTitle("Mirielle — Pre-debut Film — Facebook video player"),
  ).toHaveAttribute("src", /facebook\.com\/plugins\/video\.php/);
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
  await expect(page.locator(".hero-portrait")).toBeVisible();
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
