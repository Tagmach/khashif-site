// Transparent proxy: khashif.run/packnet/<slug> → khashif-agent.onrender.com/packnet/<slug>
// Mirrors the /feed/* proxy pattern. Reason: pack map page fetches the
// network row JSON via this endpoint; without the proxy the fetch goes
// cross-origin to *.onrender.com, which some ad blockers / privacy
// extensions classify as a tracker host and return ERR_BLOCKED_BY_CLIENT
// in the browser. Routing through khashif.run keeps it same-origin.
// Added 28 May 2026.

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
  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
