import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
await mkdir(".impeccable/review", { recursive: true });
const results = [];
for (const [name, width, height] of [
  ["desktop", 1440, 1000],
  ["mobile", 390, 844],
  ["narrow", 320, 740],
]) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.addStyleTag({
    content: "html { scroll-behavior: auto !important; }",
  });
  if (width > 700)
    await page
      .locator("canvas")
      .waitFor({ timeout: 20000 })
      .catch(() => {});
  await page.waitForTimeout(2000);
  await page.evaluate(async () => {
    for (const image of document.images) image.loading = "eager";
    for (let y = 0; y < document.body.scrollHeight; y += 650) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    await Promise.race([
      Promise.all(
        Array.from(document.images).map((image) =>
          image.decode().catch(() => {}),
        ),
      ),
      new Promise((resolve) => setTimeout(resolve, 10000)),
    ]);
  });
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
  });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: `.impeccable/review/${name}.png`,
    fullPage: true,
  });
  await page.screenshot({ path: `.impeccable/review/${name}-hero.png` });
  results.push({
    name,
    errors,
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    camera:
      width > 700
        ? await page
            .locator("[data-camera-state]")
            .getAttribute("data-camera-state")
        : "not mounted on mobile",
  });
  await page.close();
}
await writeFile(
  ".impeccable/review/browser-results.json",
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results, null, 2));
await browser.close();
