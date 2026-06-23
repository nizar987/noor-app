import { GenerateRequest } from '@/types';

interface RouterCallOptions extends GenerateRequest { }

interface RouterResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ContentOptions {
  contentType?: 'generate' | 'refined';
  language: string;
  theme: string;
  tone: string;
  topic: string;
  additionalInstructions?: string;
}

function buildSystemPrompt(options: ContentOptions): string {
  console.log("Options: ", options)
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
    `- Quranic verses (include surah name, verse number, and translation)`,
    `- Hadith (include narrator, source book, and grade if known)`,
    `Only include references that are directly relevant to the topic. Do not fabricate or paraphrase references — use authentic, verified text only.`,
    options.additionalInstructions?.trim()
      ? `## Additional Instructions\n${options.additionalInstructions.trim()}`
      : null,
  ].filter(Boolean);

  return sections.join('\n');
}

export async function callRouter9(options: RouterCallOptions): Promise<RouterResponse> {
  const baseUrl = process.env.NOOR_9ROUTER_BASE_URL;
  console.log("baseUrl", baseUrl);
  const apiKey = process.env.NOOR_9ROUTER_API_KEY;
  console.log("apiKey", apiKey);
  const comboName = process.env.NOOR_9ROUTER_COMBO_NAME;
  console.log("comboName", comboName);

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
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`9router API error (${response.status}): ${errorText}`);
  }

  const responseText = await response.text();
  let data;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    throw new Error(`9router returned invalid JSON (HTML/Text). First 100 chars: ${responseText.substring(0, 100)}`);
  }

  let content = data.content?.[0]?.text || data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from 9router API');
  }

  // --- Post-processing: Aggressive Cleanup ---
  content = content
    // Remove markdown horizontal rules (e.g., ---, ***, ___)
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove common AI conversational filler phrases (case-insensitive)
    .replace(/^(here is your|sure,|post generated|copy text below|tentu,|berikut adalah|berikut konten)[^\n]*\n+/gi, '')
    // Remove standalone Titles/Headers like "# Konten Facebook" or "## Judul" at the start
    .replace(/^#+.*$/gm, '')
    // Remove any remaining stray leading/trailing whitespaces or multiple blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return {
    content,
    model: data.model || comboName,
    usage: data.usage,
  };
}
