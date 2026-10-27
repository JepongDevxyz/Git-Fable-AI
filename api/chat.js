// Vercel serverless route: /api/chat
// The Meta API key lives ONLY in the Vercel environment variable
// META_API_KEY. It is never in the repo, never in the HTML, and never
// reaches the browser. The browser posts to this same-origin route,
// which forwards to the Meta Model API and streams the reply back.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const key = process.env.META_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "META_API_KEY is not set in the server environment variables" });
  }
  const body = req.body || {};
  let upstream;
  try {
    upstream = await fetch("https://api.meta.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify(body)
    });
  } catch (e) {
    return res.status(502).json({ error: "Could not reach api.meta.ai: " + e.message });
  }
  if (!upstream.ok || !upstream.body) {
    const t = await upstream.text().catch(() => "");
    return res.status(upstream.status).json({ error: "Meta API error " + upstream.status + (t ? ": " + t.slice(0, 300) : "") });
  }
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive"
  });
  const reader = upstream.body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
  } catch (e) {
    /* client went away */
  }
  res.end();
}
