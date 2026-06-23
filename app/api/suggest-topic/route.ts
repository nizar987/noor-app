import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { theme, language, tone } = await req.json();

    const baseUrl = process.env.NOOR_9ROUTER_BASE_URL;
    const apiKey = process.env.NOOR_9ROUTER_API_KEY;

    if (!baseUrl || !apiKey) {
      throw new Error('9router configuration missing.');
    }

    const apiUrl = baseUrl.endsWith('/v1') ? `${baseUrl}/messages` : `${baseUrl}/v1/messages`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'genfity/claude-sonnet-4.6',
        system: 'Kamu adalah asisten pembuat ide konten Islami.',
        messages: [
          {
            role: 'user',
            content: `Berikan SATU ide topik spesifik yang menarik untuk tema ${theme}, dengan menyesuaikan gaya bahasa ${language} dan tone/nada penyampaian yang ${tone}. \nJangan gunakan format nomor, bullet, atau penjelasan tambahan. Cukup berikan langsung kalimat topiknya dalam 1 kalimat singkat. Jangan gunakan suggest yg sama`,
          },
        ],
        max_tokens: 1024,
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

    const topic = data.content?.[0]?.text?.trim() || data.choices?.[0]?.message?.content?.trim() || '';

    return NextResponse.json({ topic });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
