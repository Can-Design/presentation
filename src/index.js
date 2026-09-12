const NOT_FOUND = () => new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
const GONE = () => new Response("This presentation link has expired or been revoked.", { status: 410, headers: { "Cache-Control": "no-store" } });

function cleanSharePath(value) {
  if (!value || !value.startsWith("/private/") || !value.endsWith("/")) return null;
  if (value.includes("..") || value.includes("\\")) return null;
  return value;
}

function cleanAssetPath(value) {
  if (!value) return "index.html";
  try {
    const decoded = decodeURIComponent(value);
    if (decoded.includes("..") || decoded.includes("\\") || decoded.startsWith("/")) return null;
    return decoded;
  } catch {
    return null;
  }
}

function fetchAsset(request, env, assetPath) {
  const url = new URL(request.url);
  url.pathname = assetPath.endsWith("/") ? `${assetPath}index.html` : assetPath;
  url.search = "";
  return env.ASSETS.fetch(new Request(url, request));
}

async function sharedAsset(request, env, token, assetPath) {
  const record = await env.PRESENTATION_LINKS
    .prepare("SELECT target_path, expires_at, revoked_at FROM share_links WHERE token = ?1")
    .bind(token)
    .first();

  if (!record || record.revoked_at || record.expires_at <= Math.floor(Date.now() / 1000)) return GONE();

  const targetPath = cleanSharePath(record.target_path);
  const safeAssetPath = cleanAssetPath(assetPath);
  if (!targetPath || !safeAssetPath) return NOT_FOUND();

  const url = new URL(request.url);
  url.pathname = `${targetPath}${safeAssetPath}`;
  url.search = "";
  const response = await env.ASSETS.fetch(new Request(url, request));
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "private, no-store");
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", { status: 405 });

    // Existing client URLs remain intentionally available during the compatibility window.
    if (pathname.startsWith("/presentations/") || pathname === "/robots.txt") {
      if (pathname.startsWith("/presentations/") && !pathname.includes(".") && !pathname.endsWith("/")) {
        return Response.redirect(`${url.pathname}/${url.search}`, 307);
      }
      return fetchAsset(request, env, pathname);
    }

    // New protected decks live under /private/ and can only be reached through /s/<token>/.
    if (pathname.startsWith("/private/") || pathname === "/" || pathname.startsWith("/dashboard/")) return NOT_FOUND();

    const match = pathname.match(/^\/s\/([A-Za-z0-9_-]{32,})\/(.*)$/);
    if (match) return sharedAsset(request, env, match[1], match[2]);

    return NOT_FOUND();
  }
};
