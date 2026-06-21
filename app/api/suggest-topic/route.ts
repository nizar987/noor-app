import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { theme, platform } = await req.json();

    const baseUrl = process.env.NOOR_9ROUTER_BASE_URL;
    const apiKey = process.env.NOOR_9ROUTER_API_KEY;

    if (!baseUrl || !apiKey) {
      throw new Error('9router configuration missing.');
    }

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'ag/gemini-3.5-flash-low',
        messages: [
          {
            role: 'system',
            content: 'Kamu adalah asisten pembuat ide konten Islami.',
          },
          {
            role: 'user',
            content: `Berikan SATU ide topik spesifik yang menarik untuk tema ${theme}. 
Jangan gunakan format nomor, bullet, atau penjelasan tambahan. Cukup berikan langsung kalimat topiknya dalam 1 kalimat singkat.`,
          },
        ],
        max_tokens: 15000,
        temperature: 0.9,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`9router Error: ${errText}`);
    }

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`9router returned invalid JSON (Stream/Text). First 100 chars: ${responseText.substring(0, 100)}`);
    }

    const topic = data.choices?.[0]?.message?.content?.trim() || '';

    return NextResponse.json({ topic });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
