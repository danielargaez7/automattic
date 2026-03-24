import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { zip, filename } = body;

    if (!zip || typeof zip !== 'string') {
      return NextResponse.json({ error: 'Missing ZIP data' }, { status: 400 });
    }

    const buffer = Buffer.from(zip, 'base64');
    const name = filename || 'theme.zip';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${name}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to prepare download' }, { status: 500 });
  }
}
