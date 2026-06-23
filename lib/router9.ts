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
    `Kamu adalah asisten ahli pembuat konten dakwah Islami untuk media sosial.`,
    `## Spesifikasi Konten`,
    `- Bahasa: ${options.language.trim()}`,
    `- Gaya Bahasa (Tone): ${options.tone.trim()}`,
    `- Tema: ${options.theme.trim()}`,
    ``,
    `## ATURAN FORMAT (WAJIB DIPATUHI):`,
    `- HANYA hasilkan teks akhir yang siap diposting.`,
    `- JANGAN sertakan kalimat pengantar/penutup (seperti "Ini konten Anda:" atau "Semoga bermanfaat").`,
    `- JANGAN sertakan judul placeholder seperti "# Konten Facebook".`,
    `- JANGAN gunakan garis pemisah (---).`,
    `- Langsung mulai dengan kalimat pertama dari konten.`,
    `- Pisahkan kutipan ayat atau hadits dari teks penjelasan dengan memberikan jarak 1 baris kosong.`,
    ``,
    `## ATURAN SYARIAT & AKIDAH:`,
    `- Konten harus akurat secara syar'i, tidak menyesatkan, serta menginspirasi dan memberi manfaat.`,
    `- Mazhab yang digunakan adalah pemahaman **Ahlussunnah Wal Jama'ah**.`,
    `- JANGAN memakai istilah yang bertentangan dengan syariat atau menyinggung mazhab/golongan lain.`,
    `- Jangan menyebutkan nama tokoh selain Nabi Muhammad ﷺ, para Sahabat, dan para Ulama yang diakui.`,
    `- Jika menyebutkan nama Ulama, sebutkan gelarnya dengan benar dan beradab.`,
    `- Jika ada hal yang kamu tidak tahu pastinya secara dalil, jangan mengarang. Lebih baik hindari atau katakan "saya tidak tahu".`,
    ``,
    `## ATURAN DALIL & REFERENSI:`,
    `- **WAJIB** menyertakan teks tulisan Arab asli untuk setiap kutipan ayat Al-Quran atau Hadits, lengkap beserta terjemahannya.`,
    `- Al-Quran: Pastikan menyebutkan nama Surah dan nomor ayat dengan tepat.`,
    `- Hadits: Pastikan menyebutkan perawi, nama kitab sumber, dan derajatnya (shahih/hasan) jika diketahui.`,
    `- Gunakan hanya referensi yang terpercaya (seperti nu.or.id, ilmiyyah.com/halaqah-silsilah-ilmiyah, atau sumber otoritatif lainnya).`,
    `- DILARANG KERAS memalsukan atau mengarang dalil (halusinasi ayat/hadits).`,
    ``,
    options.contentType === 'refined'
      ? `## Draft untuk Disempurnakan\nTolong perbaiki, rapikan, dan sempurnakan draft berikut menjadi konten dakwah yang berkualitas sesuai aturan di atas:`
      : `## Topik Pembahasan`,
    options.topic.trim(),
    ``,
    `## Instruksi Tambahan (Opsional):`,
    `- Jangan menambahkan hal-hal yang melenceng atau tidak relevan dengan topik di atas.`,
    `- Tambahkan kisah sejarah/sirah Nabi atau Sahabat jika dirasa sangat relevan untuk menguatkan pesan, terutama jika ada nama sahabat yang disebutkan.`,
    options.additionalInstructions?.trim() ? `- ${options.additionalInstructions.trim()}` : null,
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
      max_tokens: 8096,
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
