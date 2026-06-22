// ===== Platform Types =====
export type Platform = 'instagram' | 'tiktok' | 'facebook' | 'twitter';

// ===== Theme Types =====
export type ContentTheme = 
  | 'dawah'
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
  platform: Platform;
  theme: ContentTheme;
  language: Language;
  tone: Tone;
  topic: string;
  additionalInstructions?: string;
}

// ===== Generation Result =====
export interface GenerateResult {
  content: string;
  platform: Platform;
  theme: ContentTheme;
  language: Language;
  tone: Tone;
  topic: string;
  additionalInstructions?: string;
  comboUsed: string;
  createdAt: string;
}

// ===== History Entry =====
export interface HistoryEntry extends GenerateResult {
  id: string;
}

// ===== Platform Meta =====
export interface PlatformMeta {
  id: Platform;
  label: string;
  icon: string;
  description: string;
  maxChars?: number;
  color: string;
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
