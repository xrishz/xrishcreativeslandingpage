import { findLatestFacebookVideo, type FacebookPost } from "@/lib/facebook";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
};

export async function GET() {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const graphVersion = process.env.FACEBOOK_GRAPH_API_VERSION || "v26.0";

  if (!pageId || !accessToken) {
    return Response.json(
      { status: "unconfigured", video: null },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const fields =
    "id,message,created_time,permalink_url,attachments{media_type,target,url,subattachments{media_type,target,url}}";
  const url = new URL(
    `https://graph.facebook.com/${graphVersion}/${encodeURIComponent(pageId)}/posts`,
  );
  url.searchParams.set("fields", fields);
  url.searchParams.set("limit", "20");
  url.searchParams.set("access_token", accessToken);

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      return Response.json(
        { status: "unavailable", video: null },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const payload = (await response.json()) as { data?: FacebookPost[] };
    const video = findLatestFacebookVideo(payload.data ?? []);
    return Response.json(
      { status: video ? "ready" : "empty", video: video ?? null },
      { headers: CACHE_HEADERS },
    );
  } catch {
    return Response.json(
      { status: "unavailable", video: null },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
