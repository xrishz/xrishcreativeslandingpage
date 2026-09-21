import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { streamPlayerUrl } from "../src/lib/stream";

test("Stream placeholder is honest, makes no player request and lists only the five events", async ({
  page,
}) => {
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("cloudflarestream.com"))
      videoRequests.push(request.url());
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Full Pre-debut Film" }),
  ).toBeVisible();
  await expect(page.getByText("Coming soon.", { exact: true })).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
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

test("real gallery opens, changes photographs, traps focus and restores it", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "View In full bloom." });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("01 / 03")).toBeVisible();
  await page.getByRole("button", { name: "Next photograph" }).click();
  await expect(page.getByText("02 / 03")).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByText("01 / 03")).toBeVisible();
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

test("mobile navigation, contact sheet and narrow layout remain usable", async ({
  page,
}) => {
  const modelRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes(".glb")) modelRequests.push(request.url());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".hero-camera")).toHaveCount(0);
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

test("reduced motion and WebGL failure preserve work and inquiry", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    // Deliberately exercise a browser without a WebGL context.
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      ...args: Parameters<typeof original>
    ) {
      return String(args[0]).includes("webgl")
        ? null
        : original.apply(this, args);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator("[data-camera-state]")).toHaveAttribute(
    "data-camera-state",
    "fallback",
  );
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("button", { name: "Take a closer look" }).click();
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
