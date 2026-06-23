// ===== Content Types =====
export type ContentType = 'generate' | 'refined';

// ===== Theme Types =====
export type ContentTheme = 
  | 'dawah'
  | 'tauhid'
  | 'tafsir'
  | 'hadith'
  | 'fiqh'
  | 'sirah'
  | 'motivasi';

// ===== Language Types =====
export type Language = 'indonesia' | 'english' | 'arabic' | 'indonesia_sunda';

// ===== Tone Types =====
export type Tone = 'inspiring' | 'academic' | 'friendly' | 'urgent' | 'poetic';

// ===== Generation Request =====
export interface GenerateRequest {
  contentType?: ContentType;
  theme: ContentTheme;
  language: Language;
  tone: Tone;
  topic: string;
  additionalInstructions?: string;
}

// ===== Generation Result =====
export interface GenerateResult {
  content: string;
  contentType?: ContentType;
  theme: ContentTheme;
  language: Language;
  tone: Tone;
  topic: string;
  additionalInstructions?: string;
  comboUsed: string;
  createdAt: string;
}



// ===== Theme Meta =====
export interface ThemeMeta {
  id: ContentTheme;
  label: string;
  labelArabic: string;
  icon: string;
}

// ===== Tone Meta =====
export interface ToneMeta {
  id: Tone;
  label: string;
  description: string;
  icon: string;
}
