export type StreamIdentifiers = {
  videoId?: string;
  customerCode?: string;
};

export function streamPlayerUrl(film: StreamIdentifiers): string | undefined {
  if (
    !film.videoId ||
    !/^[a-f0-9]{32}$/i.test(film.videoId) ||
    !film.customerCode ||
    !/^[a-z0-9]+$/i.test(film.customerCode)
  )
    return;
  return `https://customer-${film.customerCode}.cloudflarestream.com/${film.videoId}/iframe`;
}
