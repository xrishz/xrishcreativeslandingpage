import sharp from "sharp";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const target = path.join(root, "public/portfolio");
await mkdir(target, { recursive: true });
const sources = ["ASSETS/photos/original", "ASSETS/photos/cherrielle"];
const manifest = [];
for (const source of sources) {
  const files = (await readdir(path.join(root, source))).filter((name) =>
    /\.jpe?g$/i.test(name),
  );
  for (const file of files) {
    const name = file
      .replace(/\.jpg$/i, "")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");
    const input = path.join(root, source, file);
    const output = path.join(target, `${name}.webp`);
    const info = await sharp(input)
      .rotate()
      .resize({
        width: 3600,
        height: 4800,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 90, effort: 5 })
      .toFile(output);
    const tiny = await sharp(input)
      .rotate()
      .resize({ width: 20 })
      .webp({ quality: 30 })
      .toBuffer();
    manifest.push({
      source: `${source}/${file}`,
      src: `/portfolio/${name}.webp`,
      width: info.width,
      height: info.height,
      bytes: info.size,
      blurDataURL: `data:image/webp;base64,${tiny.toString("base64")}`,
    });
  }
}
await mkdir("src/data", { recursive: true });
await writeFile("src/data/media.json", JSON.stringify(manifest, null, 2));
await writeFile(
  "public/portfolio/PROVENANCE.txt",
  "Owner-supplied XRISH CREATIVES photographs. Optimized derivatives only; source photographs are stored in ASSETS/photos.\n" +
    manifest.map((item) => `${item.src} <- ${item.source}`).join("\n"),
);
console.log(
  `Prepared ${manifest.length} real photographs; ${(manifest.reduce((total, file) => total + file.bytes, 0) / 1024 / 1024).toFixed(2)} MB total.`,
);
