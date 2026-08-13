// Converts a normal YouTube/Vimeo URL (whatever an admin would paste from
// the browser address bar or the "Share" button) into an embeddable iframe
// src. Returns null if the URL isn't recognized, so callers can hide the
// video section entirely rather than showing a broken embed.
export function toEmbedUrl(rawUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  // youtu.be/VIDEO_ID
  if (host === "youtu.be") {
    const id = url.pathname.slice(1);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  // youtube.com/watch?v=VIDEO_ID | youtube.com/shorts/VIDEO_ID | youtube.com/embed/VIDEO_ID
  if (host === "youtube.com" || host === "m.youtube.com") {
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    const shorts = url.pathname.match(/^\/shorts\/([^/]+)/);
    if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`;
    const embed = url.pathname.match(/^\/embed\/([^/]+)/);
    if (embed) return `https://www.youtube.com/embed/${embed[1]}`;
    return null;
  }

  // vimeo.com/VIDEO_ID
  if (host === "vimeo.com") {
    const id = url.pathname.match(/^\/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  if (host === "player.vimeo.com") {
    return url.pathname.startsWith("/video/") ? rawUrl : null;
  }

  return null;
}
