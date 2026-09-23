export type FacebookAttachment = {
  media_type?: string;
  target?: { url?: string };
  url?: string;
  subattachments?: { data?: FacebookAttachment[] };
};

export type FacebookPost = {
  id?: string;
  message?: string;
  created_time?: string;
  permalink_url?: string;
  attachments?: { data?: FacebookAttachment[] };
};

export type LatestFacebookVideo = {
  id: string;
  title: string;
  excerpt?: string;
  createdTime?: string;
  permalinkUrl: string;
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

export function findLatestFacebookVideo(
  posts: FacebookPost[],
): LatestFacebookVideo | undefined {
  for (const post of posts) {
    if (!post.id || !isFacebookUrl(post.permalink_url)) continue;
    if (!post.attachments?.data?.some(attachmentIsVideo)) continue;

    const message = cleanCopy(post.message);
    const firstSentence = message?.split(/(?<=[.!?])\s/)[0];
    const title = firstSentence
      ? firstSentence.slice(0, 88)
      : "Latest film from XRISH CREATIVES";

    return {
      id: post.id,
      title,
      excerpt:
        message && message !== title
          ? message.slice(0, 220) + (message.length > 220 ? "…" : "")
          : undefined,
      createdTime: post.created_time,
      permalinkUrl: post.permalink_url,
    };
  }
}

