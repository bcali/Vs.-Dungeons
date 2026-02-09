/**
 * Rate limiter using Upstash Redis (serverless-friendly).
 * Falls back to allow-all if Upstash env vars are missing (local dev).
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(10, '60 s'),
    prefix: 'vs-dungeons',
  });
  return ratelimit;
}

export async function rateLimit(
  request: Request,
  _options: { maxRequests: number; windowMs: number }
): Promise<Response | null> {
  const limiter = getRatelimit();

  // Fail-open: no Upstash configured → allow all requests
  if (!limiter) return null;

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  try {
    const { success, limit, remaining } = await limiter.limit(ip);

    if (!success) {
      return Response.json(
        { error: 'Too many requests. Slow down.' },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': String(remaining),
          },
        }
      );
    }

    return null;
  } catch (error) {
    // Fail-open: if Redis is unreachable, allow the request
    console.warn('Rate limiter unavailable, allowing request:', error);
    return null;
  }
}
