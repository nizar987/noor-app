import { NextRequest, NextResponse } from 'next/server';
import { GenerateRequest } from '@/types';
import { callRouter9 } from '@/lib/router9';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompt-builder';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateRequest;

    // Validate required fields
    if (!body.theme || !body.language || !body.tone || !body.topic) {
      return NextResponse.json(
        { error: 'Missing required fields: theme, language, tone, topic' },
        { status: 400 }
      );
    }

    // Call 9router directly with the user's payload
    const resultResponse = await callRouter9(body);

    return new Response(resultResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[/api/generate]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
