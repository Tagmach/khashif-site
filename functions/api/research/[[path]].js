// Same-origin proxy: khashif.run/api/research/* → khashif-agent.onrender.com/research/*
// Mirrors the /feed/* proxy pattern. Keeps the Research surface inside
// khashif.run so ad blockers don't flag the onrender.com host
// (ERR_BLOCKED_BY_CLIENT). Substrate carry-over from the
// retired /packnet proxy (which served the same purpose for the
// abandoned Personal Pack work).
//
// Catches: POST /api/research, GET /api/research/<slug>,
//          GET /api/research/<slug>/network
// Method, headers, query string, and body pass through. The URL bar
// stays on khashif.run; the response body comes from the agent backend.
// Added 28 May 2026 (Topic Research v0.1 Phase B).

const BACKEND = "https://khashif-agent.onrender.com";

export async function onRequest({ request }) {
  const url = new URL(request.url);
  // Strip the /api prefix so /api/research/<slug>/network -> /research/<slug>/network
  const backendPath = url.pathname.replace(/^\/api/, "");
  const upstream = BACKEND + backendPath + url.search;
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
