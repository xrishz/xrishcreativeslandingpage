import {
  findFacebookVideos,
  isCuratedFacebookFilm,
  type FacebookPost,
  type LatestFacebookVideo,
} from "@/lib/facebook";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
};

const REQUEST_DEADLINE_MS = 22000;
const GRAPH_REQUEST_TIMEOUT_MS = 6000;
const EMBED_REQUEST_TIMEOUT_MS = 5000;

const boundedSignal = (deadline: AbortSignal, timeout: number) =>
  AbortSignal.any([deadline, AbortSignal.timeout(timeout)]);

const graphHeaders = (accessToken: string) => ({
  Accept: "application/json",
  Authorization: `Bearer ${accessToken}`,
});

async function resolvePageAccessToken(
  graphVersion: string,
  pageId: string,
  systemUserToken: string,
  deadline: AbortSignal,
) {
  const url = new URL(`https://graph.facebook.com/${graphVersion}/me/accounts`);
  url.searchParams.set("fields", "id,access_token");
  url.searchParams.set("limit", "100");

  const response = await fetch(url, {
    cache: "no-store",
    headers: graphHeaders(systemUserToken),
    signal: boundedSignal(deadline, GRAPH_REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) return undefined;

  const payload = (await response.json()) as {
    data?: Array<{ id?: string; access_token?: string }>;
  };
  return payload.data?.find((page) => page.id === pageId)?.access_token;
}

function fetchPagePosts(url: URL, accessToken: string, deadline: AbortSignal) {
  return fetch(url, {
    headers: graphHeaders(accessToken),
    next: { revalidate: 1800 },
    signal: boundedSignal(deadline, GRAPH_REQUEST_TIMEOUT_MS),
  });
}

async function canEmbedOnFacebook(
  video: LatestFacebookVideo,
  deadline: AbortSignal,
) {
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
      signal: boundedSignal(deadline, EMBED_REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return false;
    const html = await response.text();
    return html.includes('"videoData"');
  } catch {
    return false;
  }
}

export async function GET() {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const graphVersion = process.env.FACEBOOK_GRAPH_API_VERSION || "v26.0";
  const deadline = AbortSignal.timeout(REQUEST_DEADLINE_MS);

  if (!pageId || !accessToken) {
    return Response.json(
      { status: "unconfigured", video: null },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const fields =
    "id,message,created_time,permalink_url,full_picture,attachments{media_type,target,url,subattachments{media_type,target,url}}";
  const url = new URL(
    `https://graph.facebook.com/${graphVersion}/${encodeURIComponent(pageId)}/posts`,
  );
  url.searchParams.set("fields", fields);
  url.searchParams.set("limit", "20");

  try {
    let response = await fetchPagePosts(url, accessToken, deadline);

    // A Meta system-user token may need to be exchanged for the assigned
    // Page token before Page posts can be read. Keep both credentials server-only.
    if (!response.ok) {
      const pageAccessToken = await resolvePageAccessToken(
        graphVersion,
        pageId,
        accessToken,
        deadline,
      );
      if (pageAccessToken) {
        response = await fetchPagePosts(url, pageAccessToken, deadline);
      }
    }

    if (!response.ok) {
      return Response.json(
        { status: "unavailable", video: null },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const payload = (await response.json()) as { data?: FacebookPost[] };
    const candidates = findFacebookVideos(payload.data ?? [])
      .filter((video) => !isCuratedFacebookFilm(video))
      .slice(0, 8);
    const embedChecks = await Promise.all(
      candidates.map((candidate) => canEmbedOnFacebook(candidate, deadline)),
    );
    const video = candidates.find((_, index) => embedChecks[index]);
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
