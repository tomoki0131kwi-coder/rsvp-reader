// Optional personal CORS proxy for Cloudflare Workers (free plan is enough).
// Only fetches Project Gutenberg URLs, so it can't be abused as an open proxy.
// Deploy, then set in the app: 設定 → 独自のCORSプロキシ →  https://<your-worker>.workers.dev/?url={url}

const ALLOWED = /^https:\/\/(www\.)?gutenberg\.org\/(cache\/epub|files|ebooks)\//;

export default {
  async fetch(request) {
    const target = new URL(request.url).searchParams.get('url') || '';
    if (!ALLOWED.test(target)) return new Response('Only gutenberg.org book URLs are allowed', { status: 400 });
    const res = await fetch(target, { headers: { 'User-Agent': 'rsvp-reader-proxy' }, cf: { cacheTtl: 86400 } });
    const headers = new Headers(res.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    return new Response(res.body, { status: res.status, headers });
  },
};
