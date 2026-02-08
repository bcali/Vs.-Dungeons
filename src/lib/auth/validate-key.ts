/**
 * Validates the X-App-Key header against APP_SECRET_KEY.
 * Protects API routes from unauthorized access / Claude bill abuse.
 * Returns a Response if invalid, or null if valid.
 */
export function validateAppKey(request: Request): Response | null {
  const appKey = request.headers.get('x-app-key');
  const secretKey = process.env.APP_SECRET_KEY;

  // If no secret is configured, skip auth (local dev)
  if (!secretKey) return null;

  if (!appKey || appKey !== secretKey) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
