import imageIds from "@/data/cloudflare-images.json";

const accountHash = "1orB03L1aPM48OOm9G94vg";

export function hostedImageUrl(src: string, width: number): string | undefined {
  const filename = src.split("/").at(-1) as keyof typeof imageIds | undefined;
  const id = filename && imageIds[filename];
  if (!id) return undefined;
  const safeWidth = Math.min(3840, Math.max(64, Math.round(width)));
  return `https://imagedelivery.net/${accountHash}/${id}/w=${safeWidth},q=90`;
}
