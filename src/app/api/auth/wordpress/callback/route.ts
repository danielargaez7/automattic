import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/wordpress/callback
 * Handles the WordPress.com OAuth2 authorization code redirect.
 * Exchanges the code for an access token and stores it in a secure cookie.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3333';

  if (!code) {
    return NextResponse.redirect(new URL('/?wp_auth=error&reason=no_code', appUrl));
  }

  const clientId = process.env.WORDPRESS_CLIENT_ID;
  const clientSecret = process.env.WORDPRESS_CLIENT_SECRET;
  const redirectUri = `${appUrl}/api/auth/wordpress/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/?wp_auth=error&reason=not_configured', appUrl));
  }

  try {
    const tokenRes = await fetch('https://public-api.wordpress.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL('/?wp_auth=error&reason=token_exchange', appUrl));
    }

    const { access_token } = await tokenRes.json();

    const response = NextResponse.redirect(new URL('/?wp_auth=success', appUrl));
    response.cookies.set('wp_access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.redirect(new URL('/?wp_auth=error&reason=server_error', appUrl));
  }
}
