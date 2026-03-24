import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/wordpress/sites
 * Returns the authenticated user's WordPress.com sites.
 */
export async function GET(request: NextRequest) {
  const token = request.cookies.get('wp_access_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const res = await fetch('https://public-api.wordpress.com/rest/v1.1/me/sites?fields=ID,name,URL,is_wpcom_atomic', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch sites' }, { status: res.status });
  }

  const { sites } = await res.json();
  return NextResponse.json({ sites: sites || [] });
}
