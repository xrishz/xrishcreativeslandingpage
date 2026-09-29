import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const output = "test-results/motion-qa";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext();
await context.addInitScript(() => sessionStorage.setItem("xrish-intro-seen", "true"));
await context.route("**/api/facebook/latest-video", (route) => route.abort());
const page = await context.newPage();
const observations = [];

for (const width of [390, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.locator(".intro-loader").waitFor({ state: "hidden" });
  await page.screenshot({ path: `${output}/home-${width}.png` });
  await page.locator(".story-spread").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${output}/stories-${width}.png` });
  observations.push(await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    stories: [...document.querySelectorAll(".story-spread .story img")].map((img) => ({
      loaded: img.complete && img.naturalWidth > 0,
      wrapperHeight: Math.round(img.parentElement?.parentElement?.getBoundingClientRect().height ?? 0),
      clip: getComputedStyle(img.parentElement?.parentElement).clipPath,
    })),
  })));
}

for (const route of ["works", "about", "faq", "a-missing-frame"]) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`http://localhost:3000/${route}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `${output}/${route}-1440.png` });
}
await page.goto("http://localhost:3000/about", { waitUntil: "domcontentloaded" });
await page.locator(".experience-reactions").scrollIntoViewIfNeeded();
await page.waitForTimeout(1100);
await page.screenshot({ path: `${output}/about-reactions.png` });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.locator(".intro-loader").waitFor({ state: "hidden" });
await page.locator(".footer").scrollIntoViewIfNeeded();
await page.waitForTimeout(1100);
await page.screenshot({ path: `${output}/footer-1440.png` });
console.log(JSON.stringify(observations, null, 2));
await browser.close();
