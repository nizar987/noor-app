import { Language, Tone, ContentTheme, ContentType } from '@/types';

// ===== System Prompt Builder =====
export function buildSystemPrompt(language: Language): string {
  const langInstructions: Record<Language, string> = {
    indonesia: 'Gunakan Bahasa Indonesia yang baik, mengalir, dan mudah dipahami masyarakat umum.',
    english: 'Use clear, eloquent English appropriate for a global Muslim audience.',
    arabic: 'استخدم اللغة العربية الفصحى مع مراعاة سهولة الفهم.',
    indonesia_sunda: 'Gunakan Bahasa Indonesia dengan bumbu sunda yang baik, mengalir, dan mudah dipahami masyarakat umum atau orang sunda.',
  };

  return `Kamu adalah asisten spesialis pembuatan konten dakwah Islam untuk media sosial.

BAHASA: ${langInstructions[language]}

FORMAT KONTEN:
- Buat konten yang menarik dan cocok untuk diposting di media sosial secara umum
- Gunakan paragraf yang mudah dibaca (tidak terlalu panjang)
- Tambahkan hashtag yang relevan di bagian akhir
- Sertakan Call-to-Action (CTA) yang sesuai di penutup

PANDUAN KONTEN ISLAM:
- Pastikan semua referensi Al-Quran menyebutkan surah dan ayat dengan benar
- Pastikan hadits disebutkan perawi dan derajatnya
- Konten harus akurat secara syar'i dan tidak menyesatkan
- Gunakan tone yang sesuai dengan permintaan user
- Konten harus memberi manfaat dan menginspirasi pembaca
- Mahzab yang digunakan adalah Mahzab Ahlussunnah Waljama'ah
- WAJIB menyertakan teks tulisan Arab asli untuk setiap kutipan ayat Al-Quran atau Hadits, lengkap dengan terjemahannya, nama Surah dan nomor ayat (atau perawi untuk Hadits).
- jika tidak tahu sesuatu, katakan 'tidak tahu' atau 'saya tidak tahu' jangan berbohong
- Jangan memakai kata yang tidak sesuai dengan syariat dan jangan memakai kata kata yang menyinggung mahzab atau golongan lain
- Jangan menambahkan kata kata yang tidak perlu atau tidak sesuai dengan topik
- gunakan reference yang terpercaya, seperti website nu.or.id, https://ilmiyyah.com/halaqah-silsilah-ilmiyah

PENTING: Jika ada ketidakpastian tentang referensi hadits, lebih baik tidak menyebutkannya daripada menyebut hadits palsu.`;
}

// ===== User Prompt Builder =====
export function buildUserPrompt(
  contentType: ContentType | undefined,
  theme: ContentTheme,
  tone: Tone,
  topic: string,
  additionalInstructions?: string
): string {
  const themeLabels: Record<ContentTheme, string> = {
    dawah: "Da'wah & Seruan Islam",
    tauhid: "Tauhid & Akidah",
    tafsir: 'Tafsir Al-Quran',
    hadith: 'Hadits & Sunnah',
    fiqh: 'Fiqh & Hukum Islam',
    sirah: 'Sirah Nabawiyah',
    motivasi: 'Motivasi & Inspirasi Islam',
  };

  const toneDescriptions: Record<Tone, string> = {
    inspiring: 'menginspirasi, membangkitkan semangat, dan memotivasi',
    academic: 'akademis, terstruktur, berdasarkan dalil, dan ilmiah',
    friendly: 'ramah, santai, conversational, dan dekat dengan pembaca',
    urgent: 'mendesak, menyentuh hati, dan mengajak segera beramal',
    poetic: 'puitis, indah, menggunakan kiasan dan bahasa sastra',
  };

  let prompt = contentType === 'refined'
    ? `Tolong perbaiki dan sempurnakan (refine) draf / catatan berikut menjadi konten media sosial Islam yang rapi, mengalir, dan siap posting dengan tema: ${themeLabels[theme]}
    
TEKS/DRAF ASLI:
${topic}

TONE YANG DIINGINKAN: ${toneDescriptions[tone]}`
    : `Buat konten Islam dengan tema: ${themeLabels[theme]}

TOPIK SPESIFIK: ${topic}

TONE YANG DIINGINKAN: ${toneDescriptions[tone]}`;

  if (additionalInstructions) {
    prompt += `\n\nINSTRUKSI TAMBAHAN: ${additionalInstructions}`;
  }

  prompt += '\n\nBuat konten media sosial yang berkualitas tinggi dan siap diposting.';

  return prompt;
}
