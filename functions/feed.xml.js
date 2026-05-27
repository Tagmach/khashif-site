// Transparent proxy: khashif.run/feed.xml → khashif-agent.onrender.com/feed.xml
// Companion to functions/feed/[[path]].js for the RSS surface. Same
// mechanism, separate route because /feed.xml is not under /feed/.

const BACKEND = "https://khashif-agent.onrender.com";

export async function onRequest({ request }) {
  const url = new URL(request.url);
  const upstream = BACKEND + url.pathname + url.search;
  const response = await fetch(upstream, {
    method: request.method,
    headers: request.headers,
    redirect: "manual",
  });
  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
