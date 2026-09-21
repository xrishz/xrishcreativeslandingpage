import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { streamPlayerUrl } from "../src/lib/stream";

test.beforeEach(async ({ page }) => {
  // Keep tests deterministic; real Facebook playback is verified in the live browser.
  await page.route("https://www.facebook.com/plugins/video.php**", (route) =>
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
  await page.mouse.move(180, 160);
  await expect(page.locator(".camera-cursor[data-visible='true']")).toBeVisible();
  await expect(page.locator(".camera-cursor-trail")).toHaveCount(1);
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

test("real gallery opens, changes photographs, traps focus and restores it", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "View In full bloom." });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByText("01 / 03")).toBeVisible();
  await page.getByRole("button", { name: "Next photograph" }).click();
  await expect(page.getByRole("dialog").getByText("02 / 03")).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("dialog").getByText("01 / 03")).toBeVisible();
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
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
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

test("reduced motion keeps the photographic hero, work and inquiry available", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
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
