import { NextRequest, NextResponse } from 'next/server';

interface PublishBody {
  zip: string;       // base64-encoded ZIP
  slug: string;
  siteId: number;
}

/**
 * POST /api/publish
 * Uploads a generated theme ZIP to the user's WordPress.com site.
 * Requires a valid wp_access_token cookie (set by the OAuth callback).
 */
export async function POST(request: NextRequest) {
  const token = request.cookies.get('wp_access_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated with WordPress.com' }, { status: 401 });
  }

  const body: PublishBody = await request.json();
  const { zip, slug, siteId } = body;

  if (!zip || !siteId) {
    return NextResponse.json({ error: 'zip and siteId are required' }, { status: 400 });
  }

  const bytes = Buffer.from(zip, 'base64');
  const formData = new FormData();
  formData.append(
    'zip',
    new Blob([bytes], { type: 'application/zip' }),
    `${slug || 'theme'}.zip`
  );

  const uploadRes = await fetch(
    `https://public-api.wordpress.com/rest/v1.1/sites/${siteId}/themes/upload`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }
  );

  const result = await uploadRes.json();

  if (!uploadRes.ok) {
    return NextResponse.json(
      { error: result.message || 'Upload failed' },
      { status: uploadRes.status }
    );
  }

  return NextResponse.json(result);
}
