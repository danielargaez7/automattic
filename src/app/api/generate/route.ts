import { NextRequest, NextResponse } from 'next/server';
import { UserInputSchema } from '@/lib/schemas/user-input';
import { runPipeline } from '@/lib/pipeline';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parseResult = UserInputSchema.safeParse(body);
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      }));
      return NextResponse.json({ error: 'Invalid input', details: errors }, { status: 400 });
    }

    // Run the pipeline
    const result = await runPipeline(parseResult.data);

    // Return the ZIP as base64 + metadata
    return NextResponse.json({
      zip: result.packageResult.buffer.toString('base64'),
      metadata: {
        name: result.generation.spec.metadata.name,
        slug: result.generation.spec.metadata.slug,
        description: result.generation.spec.metadata.description,
        files: result.packageResult.files,
        model: result.generation.model,
        promptVersion: result.generation.promptVersion,
        tokensUsed: result.generation.tokensUsed,
        repairAttempts: result.generation.repairAttempts,
        integrity: result.packageResult.integrity,
      },
      accessibility: result.accessibility,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Generation error:', message);

    // Rate limit
    if (message.includes('rate limit')) {
      return NextResponse.json({ error: message }, { status: 429 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
