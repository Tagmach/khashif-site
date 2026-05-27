// Transparent proxy: khashif.run/feed/* → khashif-agent.onrender.com/feed/*
// Replaces the _redirects-based attempt (Cloudflare Pages does not support
// cross-origin 200 rewrites via _redirects). Pages Functions are the
// canonical mechanism. Added 27 May 2026.
//
// Catches: /feed, /feed/, /feed/README.md, /feed/news.md, /feed/intersections.md.
// Headers, query string, and method are passed through. The URL bar
// stays on khashif.run; the response body comes from the agent backend.
// Substrate bridge for Memory Block Kit v1 (B-model integration).

const BACKEND = "https://khashif-agent.onrender.com";

export async function onRequest({ request }) {
  const url = new URL(request.url);
  const upstream = BACKEND + url.pathname + url.search;
  const init = {
    method: request.method,
    headers: request.headers,
    redirect: "manual",
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }
  const response = await fetch(upstream, init);
  // Strip hop-by-hop headers and let Cloudflare set its own.
  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
