import { Platform, Language, Tone, ContentTheme } from '@/types';

// ===== Platform-specific format instructions =====
function getPlatformFormat(platform: Platform): string {
  const formats: Record<Platform, string> = {
    instagram: `Format output sebagai:
- Caption menarik (max 2200 karakter)
- Maksimal 10 hashtag relevan di akhir
- Gunakan emoji yang tepat dan tidak berlebihan
- Mulai dengan hook yang kuat`,
    tiktok: `Format output sebagai script video:
- Hook opening yang kuat (3-5 detik pertama)
- Konten utama (60-90 detik total)
- Call to action di akhir
- Tandai dengan [HOOK], [KONTEN], [CTA]`,
    facebook: `Format output sebagai:
- Post panjang yang informatif
- Struktur: Pembuka → Isi → Penutup → CTA
- Bisa include pertanyaan untuk engagement
- Tidak ada batasan karakter ketat`,
    twitter: `Format output sebagai thread Twitter:
- Tweet 1: Hook/teaser (max 280 karakter)
- Tweet 2-4: Isi konten (max 280 karakter per tweet)
- Tweet terakhir: CTA atau penutup
- Tandai setiap tweet dengan "1/" "2/" dst`,
  };
  return formats[platform];
}

// ===== System Prompt Builder =====
export function buildSystemPrompt(platform: Platform, language: Language): string {
  const platformFormat = getPlatformFormat(platform);

  const langInstructions: Record<Language, string> = {
    indonesia: 'Gunakan Bahasa Indonesia yang baik, mengalir, dan mudah dipahami masyarakat umum.',
    english: 'Use clear, eloquent English appropriate for a global Muslim audience.',
    arabic: 'استخدم اللغة العربية الفصحى مع مراعاة سهولة الفهم.',
    indonesia_sunda: 'Gunakan Bahasa Indonesia dengan bumbu sunda yang baik, mengalir, dan mudah dipahami masyarakat umum atau orang sunda.',
  };

  return `Kamu adalah asisten spesialis pembuatan konten dakwah Islam untuk platform ${platform}.

BAHASA: ${langInstructions[language]}

FORMAT PLATFORM:
${platformFormat}

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
  theme: ContentTheme,
  tone: Tone,
  topic: string,
  additionalInstructions?: string
): string {
  const themeLabels: Record<ContentTheme, string> = {
    dawah: "Da'wah & Seruan Islam",
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

  let prompt = `Buat konten Islam dengan tema: ${themeLabels[theme]}

TOPIK SPESIFIK: ${topic}

TONE YANG DIINGINKAN: ${toneDescriptions[tone]}`;

  if (additionalInstructions) {
    prompt += `\n\nINSTRUKSI TAMBAHAN: ${additionalInstructions}`;
  }

  prompt += '\n\nBuat konten yang berkualitas tinggi sesuai format platform yang ditentukan.';

  return prompt;
}
