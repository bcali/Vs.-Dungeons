/**
 * Simple in-memory rate limiter for API routes.
 * Tracks requests per IP within a sliding window.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, 5 * 60 * 1000);
}

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

export function rateLimit(
  request: Request,
  options: RateLimitOptions
): Response | null {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const key = `rate:${ip}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return null;
  }

  entry.count++;

  if (entry.count > options.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return Response.json(
      { error: 'Too many requests. Slow down.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  return null;
}
