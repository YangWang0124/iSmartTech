export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return preventHtmlCaching(response);
    const url = new URL(request.url);
    if (request.method === "GET" && !url.pathname.includes(".")) {
      const indexResponse = await env.ASSETS.fetch(new Request(new URL("/index.html", url), request));
      return preventHtmlCaching(indexResponse);
    }
    return response;
  },
};

function preventHtmlCaching(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  headers.set("Pragma", "no-cache");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
