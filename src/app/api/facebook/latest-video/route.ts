import {
  facebookEmbedPreview,
  findFacebookVideos,
  isCuratedFacebookFilm,
  type FacebookPost,
  type LatestFacebookVideo,
} from "@/lib/facebook";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
};

const graphHeaders = (accessToken: string) => ({
  Accept: "application/json",
  Authorization: `Bearer ${accessToken}`,
});

async function resolvePageAccessToken(
  graphVersion: string,
  pageId: string,
  systemUserToken: string,
) {
  const url = new URL(`https://graph.facebook.com/${graphVersion}/me/accounts`);
  url.searchParams.set("fields", "id,access_token");
  url.searchParams.set("limit", "100");

  const response = await fetch(url, {
    cache: "no-store",
    headers: graphHeaders(systemUserToken),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    console.error("Facebook Page token lookup failed", { status: response.status });
    return undefined;
  }

  const payload = (await response.json()) as {
    data?: Array<{ id?: string; access_token?: string }>;
  };
  return payload.data?.find((page) => page.id === pageId)?.access_token;
}

function fetchPagePosts(url: URL, accessToken: string) {
  return fetch(url, {
    headers: graphHeaders(accessToken),
    next: { revalidate: 1800 },
    signal: AbortSignal.timeout(8000),
  });
}

async function canEmbedOnFacebook(video: LatestFacebookVideo) {
  const embedUrl = new URL("https://www.facebook.com/plugins/video.php");
  embedUrl.searchParams.set("height", "314");
  embedUrl.searchParams.set("href", video.permalinkUrl);
  embedUrl.searchParams.set("show_text", "false");
  embedUrl.searchParams.set("width", "560");
  embedUrl.searchParams.set("t", "0");

  try {
    const response = await fetch(embedUrl, {
      headers: {
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return { playable: false };
    const html = await response.text();
    return {
      playable: html.includes('"videoData"'),
      previewUrl: facebookEmbedPreview(html),
    };
  } catch {
    return { playable: false };
  }
}

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

  try {
    let response = await fetchPagePosts(url, accessToken);

    // A Meta system-user token may need to be exchanged for the assigned
    // Page token before Page posts can be read. Keep both credentials server-only.
    if (!response.ok) {
      console.error("Facebook initial Page posts lookup failed", { status: response.status });
      const pageAccessToken = await resolvePageAccessToken(
        graphVersion,
        pageId,
        accessToken,
      );
      if (pageAccessToken) {
        response = await fetchPagePosts(url, pageAccessToken);
      }
    }

    if (!response.ok) {
      console.error("Facebook Page posts lookup unavailable", { status: response.status });
      return Response.json(
        { status: "unavailable", video: null },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const payload = (await response.json()) as { data?: FacebookPost[] };
    const candidates = findFacebookVideos(payload.data ?? [])
      .filter((video) => !isCuratedFacebookFilm(video))
      .slice(0, 8);
    const embedChecks = await Promise.all(candidates.map(canEmbedOnFacebook));
    const selectedIndex = embedChecks.findIndex((result) => result.playable);
    const video = selectedIndex >= 0 ? candidates[selectedIndex] : undefined;
    if (video && !video.previewUrl)
      video.previewUrl = embedChecks[selectedIndex].previewUrl;
    return Response.json(
      { status: video ? "ready" : "empty", video: video ?? null },
      { headers: CACHE_HEADERS },
    );
  } catch (error) {
    console.error("Facebook latest-video request failed", {
      reason: error instanceof Error ? error.name : "unknown",
    });
    return Response.json(
      { status: "unavailable", video: null },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
