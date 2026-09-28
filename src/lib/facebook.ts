export type FacebookAttachment = {
  media_type?: string;
  media?: { image?: { src?: string } };
  target?: { url?: string };
  url?: string;
  subattachments?: { data?: FacebookAttachment[] };
};

export type FacebookPost = {
  id?: string;
  message?: string;
  created_time?: string;
  permalink_url?: string;
  full_picture?: string;
  attachments?: { data?: FacebookAttachment[] };
};

export type LatestFacebookVideo = {
  id: string;
  title: string;
  excerpt?: string;
  createdTime?: string;
  permalinkUrl: string;
  previewUrl?: string;
};

const CURATED_FACEBOOK_FILM_IDS = new Set([
  "1032666439513604", // Mirielle — Pre-debut Film
  "4579322825726121", // Angel — Debut Same Day Edit
]);

export const isCuratedFacebookFilm = (video: LatestFacebookVideo) => {
  try {
    const segments = new URL(video.permalinkUrl).pathname.split("/").filter(Boolean);
    return segments.some((segment) => CURATED_FACEBOOK_FILM_IDS.has(segment));
  } catch {
    return false;
  }
};

const isFacebookUrl = (value: string | undefined): value is string => {
  if (!value) return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "facebook.com" || url.hostname.endsWith(".facebook.com"))
    );
  } catch {
    return false;
  }
};

const attachmentIsVideo = (attachment: FacebookAttachment): boolean => {
  if (attachment.media_type?.toLowerCase() === "video") return true;
  if (
    [attachment.target?.url, attachment.url].some(
      (url) => isFacebookUrl(url) && /\/(reel|videos|watch)\b/i.test(url),
    )
  )
    return true;
  return Boolean(attachment.subattachments?.data?.some(attachmentIsVideo));
};

const cleanCopy = (value: string | undefined) =>
  value?.replace(/\s+/g, " ").trim();

export const safeFacebookImage = (value: string | undefined) => {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    const trustedHost =
      url.hostname === "facebook.com" ||
      url.hostname.endsWith(".facebook.com") ||
      url.hostname.endsWith(".fbcdn.net") ||
      url.hostname.endsWith(".fbsbx.com");
    return url.protocol === "https:" && trustedHost ? url.toString() : undefined;
  } catch {
    return undefined;
  }
};

const attachmentPreview = (
  attachment: FacebookAttachment,
): string | undefined => {
  const own = safeFacebookImage(attachment.media?.image?.src);
  if (own) return own;
  for (const child of attachment.subattachments?.data ?? []) {
    const nested = attachmentPreview(child);
    if (nested) return nested;
  }
  return undefined;
};

export function findLatestFacebookVideo(
  posts: FacebookPost[],
): LatestFacebookVideo | undefined {
  return findFacebookVideos(posts)[0];
}

export function findFacebookVideos(posts: FacebookPost[]): LatestFacebookVideo[] {
  const videos: LatestFacebookVideo[] = [];
  for (const post of posts) {
    if (!post.id || !isFacebookUrl(post.permalink_url)) continue;
    if (!post.attachments?.data?.some(attachmentIsVideo)) continue;

    const message = cleanCopy(post.message);
    const pipeTitle = message?.includes("|")
      ? message.split("|", 1)[0]?.trim()
      : undefined;
    const firstSentence = message?.split(/(?<=[.!?])\s/)[0];
    const title = pipeTitle || firstSentence || "Latest film from XRISH CREATIVES";

    videos.push({
      id: post.id,
      title,
      excerpt:
        message && message !== title
          ? message.slice(0, 220) + (message.length > 220 ? "…" : "")
          : undefined,
      createdTime: post.created_time,
      permalinkUrl: post.permalink_url,
      previewUrl:
        safeFacebookImage(post.full_picture) ||
        post.attachments?.data?.map(attachmentPreview).find(Boolean),
    });
  }
  return videos;
}
