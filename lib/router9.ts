import { GenerateRequest } from '@/types';
import { parseStreamResponse } from './stream-parser';

interface RouterCallOptions extends GenerateRequest { }

// Removed RouterResponse as we are returning the raw fetch Response directly

interface ContentOptions {
  contentType?: 'generate' | 'refined';
  language: string;
  theme: string;
  tone: string;
  topic: string;
  additionalInstructions?: string;
}

function buildSystemPrompt(options: ContentOptions): string {
  const sections = [
    `You are a content creation assistant.`,
    `## Output Requirements`,
    `- Language: ${options.language.trim()}`,
    `- Tone: ${options.tone.trim()}`,
    `- Theme: ${options.theme.trim()}`,
    `STRICT FORMATTING RULES:`,
    `- Output ONLY the final ready-to-post content.`,
    `- Do NOT include titles like "# Konten Facebook" or "Here is your post:".`,
    `- Do NOT include horizontal dividers (---).`,
    `- Start directly with the first word of the caption/post.`,
    options.contentType === 'refined'
      ? `## Draft to Refine\nPlease refine and improve the following text/draft into a high-quality Islamic social media post:`
      : `## Topic`,
    options.topic.trim(),
    `## Islamic References`,
    `Where relevant, enrich the content with:`,
    `- Quranic verses (include surah name, verse arabic text, verse number, and translation)`,
    `- Hadith (include narrator, hadith arabic text, source book, and grade if known)`,
    `Only include references that are directly relevant to the topic. Do not fabricate or paraphrase references — use authentic, verified text only.`,
    options.additionalInstructions?.trim()
      ? `## Additional Instructions\n${options.additionalInstructions.trim()}`
      : null,
  ].filter(Boolean);

  return sections.join('\n');
}

export async function callRouter9(options: RouterCallOptions): Promise<Response> {
  const baseUrl = process.env.NOOR_9ROUTER_BASE_URL;
  const apiKey = process.env.NOOR_9ROUTER_API_KEY;
  const comboName = process.env.NOOR_9ROUTER_COMBO_NAME;

  if (!baseUrl || !apiKey || !comboName) {
    throw new Error('9router configuration missing. Please check your .env.local file.');
  }

  // Use the buildSystemPrompt function to generate the command
  const promptString = buildSystemPrompt(options);

  const apiUrl = baseUrl.endsWith('/v1') ? `${baseUrl}/messages` : `${baseUrl}/v1/messages`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: comboName,
      messages: [
        { role: 'user', content: promptString },
      ],
      max_tokens: 4096,
      temperature: 0.8,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`9router API error (${response.status}): ${errorText}`);
  }

  return response;
}
