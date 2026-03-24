import { NextRequest, NextResponse } from 'next/server';
import { UserInputSchema } from '@/lib/schemas/user-input';
import { runPipeline } from '@/lib/pipeline';

function formatResult(result: Awaited<ReturnType<typeof runPipeline>>) {
  return {
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
      colors: result.generation.spec.designTokens.colors,
    },
    accessibility: result.accessibility,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { variations: wantVariations, ...inputBody } = body;

    const parseResult = UserInputSchema.safeParse(inputBody);
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      }));
      return NextResponse.json({ error: 'Invalid input', details: errors }, { status: 400 });
    }

    const input = parseResult.data;

    if (wantVariations) {
      // Generate 3 variations in parallel with different vibe hints
      const variationHints = ['', ' — focus on a light airy feel', ' — focus on a darker moodier feel'];
      const results = await Promise.allSettled(
        variationHints.map((hint, i) =>
          runPipeline({ ...input, description: input.description + (i > 0 ? hint : '') })
        )
      );

      const variations = results
        .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof runPipeline>>> => r.status === 'fulfilled')
        .map((r) => formatResult(r.value));

      if (variations.length === 0) {
        throw new Error('All variation generations failed');
      }

      return NextResponse.json({ variations });
    }

    const result = await runPipeline(input);
    return NextResponse.json(formatResult(result));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Generation error:', message);
    if (message.includes('rate limit')) {
      return NextResponse.json({ error: message }, { status: 429 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
