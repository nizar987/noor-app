import { NextRequest, NextResponse } from 'next/server';
import { GenerateRequest } from '@/types';
import { callRouter9 } from '@/lib/router9';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompt-builder';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateRequest;

    // Validate required fields
    if (!body.platform || !body.theme || !body.language || !body.tone || !body.topic) {
      return NextResponse.json(
        { error: 'Missing required fields: platform, theme, language, tone, topic' },
        { status: 400 }
      );
    }

    // Call 9router directly with the user's payload
    const result = await callRouter9(body);

    return NextResponse.json({
      content: result.content,
      model: result.model,
      usage: result.usage,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[/api/generate]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
