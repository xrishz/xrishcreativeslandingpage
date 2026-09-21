import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { mkdir, writeFile } from "node:fs/promises";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, weld, meshopt } from "@gltf-transform/functions";
import { MeshoptEncoder } from "meshoptimizer";
import sharp from "sharp";

// An original, unbranded camera. No manufacturer meshes or trademarks.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = result;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = `data:${blob.type};base64,${Buffer.from(result).toString("base64")}`;
      this.onloadend?.();
    });
  }
};
const model = new THREE.Group();
model.name = "XRISH_Camera";
const body = new THREE.MeshStandardMaterial({
  color: "#242527",
  roughness: 0.7,
  metalness: 0.26,
});
const rubber = new THREE.MeshStandardMaterial({
  color: "#111214",
  roughness: 0.95,
  metalness: 0.04,
});
body.name = "CoatedMagnesium";
rubber.name = "TexturedRubber";
const metal = new THREE.MeshStandardMaterial({
  color: "#727577",
  roughness: 0.26,
  metalness: 0.95,
});
const darkMetal = new THREE.MeshStandardMaterial({
  color: "#24272b",
  roughness: 0.32,
  metalness: 0.85,
});
const white = new THREE.MeshStandardMaterial({
  color: "#c3c5bd",
  roughness: 0.65,
});
const glass = new THREE.MeshPhysicalMaterial({
  color: "#07151d",
  metalness: 0.1,
  roughness: 0.035,
  clearcoat: 1,
  clearcoatRoughness: 0.03,
  iridescence: 0.22,
  transmission: 0.32,
  thickness: 0.2,
  ior: 1.52,
});
const inside = new THREE.MeshStandardMaterial({
  color: "#040609",
  roughness: 0.22,
  metalness: 0.5,
});
const screen = new THREE.MeshStandardMaterial({
  color: "#1d2627",
  metalness: 0.35,
  roughness: 0.2,
});

function box(name, dimensions, position, material, radius = 0.05) {
  const geometry =
    radius < 0.03
      ? new THREE.BoxGeometry(...dimensions)
      : new RoundedBoxGeometry(...dimensions, 2, radius);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  model.add(mesh);
  return mesh;
}
function cylinder(name, radius, depth, position, material, segments = 80) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, depth, segments),
    material,
  );
  mesh.name = name;
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(...position);
  model.add(mesh);
  return mesh;
}
function ring(name, radius, tube, z, material, x = -0.18, y = -0.06) {
  const mesh = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 8, 96),
    material,
  );
  mesh.name = name;
  mesh.position.set(x, y, z);
  model.add(mesh);
  return mesh;
}
box("Chassis", [2.65, 1.65, 0.82], [0, 0, 0], body, 0.16);
box("Grip", [0.67, 1.66, 1.15], [1.04, -0.04, 0.12], rubber, 0.2);
box("FrontLeather", [1.85, 1.2, 0.06], [-0.25, -0.1, 0.435], rubber, 0.07);
box("TopPlate", [2.56, 0.16, 0.84], [0, 0.78, 0], darkMetal, 0.04);
box("ViewfinderHousing", [0.72, 0.39, 0.75], [-0.2, 0.97, -0.02], body, 0.09);
box("ViewfinderEyecup", [0.67, 0.43, 0.15], [-0.2, 0.99, -0.45], rubber, 0.08);
box("ViewfinderGlass", [0.4, 0.22, 0.015], [-0.2, 0.99, -0.53], glass, 0.025);
box("Hotshoe", [0.37, 0.04, 0.38], [-0.2, 1.18, -0.02], metal, 0.015);
box("RearLCDFrame", [1.84, 1.19, 0.1], [-0.23, -0.14, -0.45], darkMetal, 0.06);
box("RearLCD", [1.64, 0.98, 0.018], [-0.23, -0.14, -0.51], screen, 0.02);
box("LCDHinge", [0.16, 0.98, 0.1], [-1.23, -0.15, -0.43], metal, 0.03);
cylinder("LensMount", 0.79, 0.13, [-0.18, -0.06, 0.49], metal);
cylinder("LensBarrel", 0.74, 1.3, [-0.18, -0.06, 1.19], body);
cylinder("FocusRing", 0.78, 0.37, [-0.18, -0.06, 1.13], rubber);
cylinder("ZoomRing", 0.79, 0.33, [-0.18, -0.06, 1.63], rubber);
cylinder("FrontRim", 0.82, 0.12, [-0.18, -0.06, 1.91], darkMetal);
cylinder("LensInterior", 0.735, 0.035, [-0.18, -0.06, 1.98], inside);
cylinder("Aperture", 0.255, 0.022, [-0.18, -0.06, 1.96], inside, 9);
const frontGlass = new THREE.Mesh(
  new THREE.SphereGeometry(0.56, 64, 32),
  glass,
);
frontGlass.name = "ConvexOpticalGlass";
frontGlass.scale.z = 0.15;
frontGlass.position.set(-0.18, -0.06, 1.99);
model.add(frontGlass);
ring("FilterThread", 0.77, 0.012, 1.99, metal);
ring("FrontGlassRing", 0.57, 0.013, 2.02, darkMetal);
ring("InnerGlassRing", 0.41, 0.014, 2.025, glass);
ring("BarrelSeamA", 0.747, 0.012, 0.76, metal);
ring("BarrelSeamB", 0.747, 0.012, 1.38, darkMetal);
for (let i = 0; i < 96; i++) {
  const angle = (i / 96) * Math.PI * 2;
  for (const [z, depth, radius] of [
    [1.13, 0.34, 0.78],
    [1.63, 0.3, 0.79],
  ]) {
    const mesh = box(
      `LensKnurl_${i}_${z}`,
      [0.012, 0.026, depth],
      [-0.18 + Math.cos(angle) * radius, -0.06 + Math.sin(angle) * radius, z],
      darkMetal,
      0.004,
    );
    mesh.rotation.z = angle - Math.PI / 2;
  }
}
for (const x of [-0.95, 0.82]) {
  const dial = cylinder("ControlDial", 0.26, 0.15, [x, 0.93, 0], darkMetal, 48);
  dial.rotation.x = 0;
  for (let i = 0; i < 28; i++) {
    const angle = (i / 28) * Math.PI * 2;
    box(
      "DialGrip",
      [0.018, 0.13, 0.018],
      [x + Math.cos(angle) * 0.255, 0.93, Math.sin(angle) * 0.255],
      metal,
      0.003,
    );
  }
}
const shutter = cylinder(
  "ShutterButton",
  0.12,
  0.07,
  [1.05, 0.82, 0.44],
  metal,
  36,
);
shutter.rotation.x = 0;
const record = cylinder(
  "RecordButton",
  0.046,
  0.03,
  [0.51, 0.89, 0.24],
  new THREE.MeshStandardMaterial({ color: "#873e32", roughness: 0.65 }),
  24,
);
record.rotation.x = 0;
for (const x of [-1.39, 1.4]) {
  box("StrapLug", [0.14, 0.2, 0.2], [x, 0.55, 0], metal, 0.045);
}
for (const y of [0.36, -0.01, -0.4])
  cylinder("RearButton", 0.075, 0.025, [1, y, -0.44], darkMetal, 24);
for (const x of [-1.11, 1.12])
  for (const y of [-0.64, 0.62]) {
    cylinder("BodyScrew", 0.027, 0.015, [x, y, 0.422], metal, 12);
    box("ScrewSlot", [0.032, 0.006, 0.008], [x, y, 0.434], inside, 0.001);
  }
// Narrow physical engravings catch light without any external font or texture.
for (let i = 0; i < 12; i++)
  box(
    "FocusScale",
    [0.009, i % 3 ? 0.034 : 0.07, 0.012],
    [-0.48 + i * 0.055, 0.665, 0.86],
    white,
    0.001,
  );
await mkdir("public/models", { recursive: true });
const result = await new GLTFExporter().parseAsync(model, { binary: true });
await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder });
const document = await io.readBinary(new Uint8Array(result));
const normalPixels = new Uint8Array(256 * 256 * 3);
let seed = 481;
for (let i = 0; i < normalPixels.length; i += 3) {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  normalPixels[i] = 100 + (seed % 56);
  seed = (seed * 1664525 + 1013904223) >>> 0;
  normalPixels[i + 1] = 100 + (seed % 56);
  normalPixels[i + 2] = 251;
}
const normalImage = await sharp(normalPixels, {
  raw: { width: 256, height: 256, channels: 3 },
})
  .png()
  .toBuffer();
const normalTexture = document
  .createTexture("OriginalMicrograin")
  .setImage(normalImage)
  .setMimeType("image/png");
for (const material of document.getRoot().listMaterials()) {
  if (["CoatedMagnesium", "TexturedRubber"].includes(material.getName()))
    material
      .setNormalTexture(normalTexture)
      .setNormalScale(material.getName() === "TexturedRubber" ? 0.48 : 0.12);
}
await document.transform(
  dedup(),
  weld(),
  meshopt({ encoder: MeshoptEncoder, level: "high" }),
);
const compressed = await io.writeBinary(document);
await writeFile("public/models/xrish-camera.glb", compressed);
await writeFile(
  "public/models/PROVENANCE.txt",
  "Original procedural XRISH camera, authored for this project using Three.js primitives and RoundedBoxGeometry. No third-party model, manufacturer logo or trademark. Rebuild with node scripts/build-camera.mjs.\n",
);
console.log(
  `Camera GLB: ${(compressed.byteLength / 1024).toFixed(0)} KB (from ${(result.byteLength / 1024).toFixed(0)} KB)`,
);
