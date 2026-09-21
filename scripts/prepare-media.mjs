import sharp from "sharp";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const target = path.join(root, "public/portfolio");
await mkdir(target, { recursive: true });
const files = (await readdir(path.join(root, "PHOTOS"))).filter((name) =>
  /\.jpe?g$/i.test(name),
);
const manifest = [];
for (const file of files) {
  const name = file
    .replace(/\.jpg$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
  const input = path.join(root, "PHOTOS", file);
  const output = path.join(target, `${name}.webp`);
  const info = await sharp(input)
    .rotate()
    .resize({
      width: 2000,
      height: 2200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 84, effort: 5 })
    .toFile(output);
  const tiny = await sharp(input)
    .rotate()
    .resize({ width: 20 })
    .webp({ quality: 30 })
    .toBuffer();
  manifest.push({
    source: `PHOTOS/${file}`,
    src: `/portfolio/${name}.webp`,
    width: info.width,
    height: info.height,
    bytes: info.size,
    blurDataURL: `data:image/webp;base64,${tiny.toString("base64")}`,
  });
}
await mkdir("src/data", { recursive: true });
await writeFile("src/data/media.json", JSON.stringify(manifest, null, 2));
await writeFile(
  "public/portfolio/PROVENANCE.txt",
  "All photographs supplied by the owner of XRISH CREATIVES in PHOTOS. Optimized derivatives only; original photographs remain untouched.\n" +
    manifest.map((item) => `${item.src} <- ${item.source}`).join("\n"),
);
console.log(
  `Prepared ${manifest.length} real photographs; ${(manifest.reduce((total, file) => total + file.bytes, 0) / 1024 / 1024).toFixed(2)} MB total.`,
);
