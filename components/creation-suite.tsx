'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentTheme, Language, Tone, GenerateRequest, ContentType } from '@/types';
import ContentPreview from './content-preview';
import CustomSelect from './custom-select';
import { useGenerate } from '@/hooks/use-generate';

/* ─── Static data ─────────────────────────────────────────────── */

const CONTENT_TYPES: { value: ContentType; label: string; icon: string }[] = [
  { value: 'generate', label: 'Create New', icon: 'edit' },
  { value: 'refined', label: 'Refine Existing', icon: 'auto_fix_high' },
];

const THEMES: { value: ContentTheme; label: string }[] = [
  { value: 'dawah',    label: "Da'wah"             },
  { value: 'tauhid',   label: 'Tauhid'             },
  { value: 'tafsir',   label: 'Tafsir'             },
  { value: 'hadith',   label: 'Hadith'             },
  { value: 'fiqh',     label: 'Fiqh'               },
  { value: 'sirah',    label: 'Sirah'              },
  { value: 'motivasi', label: 'Motivasi'           },
];

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'indonesia',       label: 'Indonesia' },
  { value: 'indonesia_sunda', label: 'Indonesia (Sunda)' },
  { value: 'english',         label: 'English'   },
  { value: 'arabic',          label: 'Arabic'    },
];

const TONES: { value: Tone; label: string }[] = [
  { value: 'inspiring', label: 'Inspiring' },
  { value: 'academic',  label: 'Academic'  },
  { value: 'friendly',  label: 'Friendly'  },
  { value: 'urgent',    label: 'Urgent'    },
  { value: 'poetic',    label: 'Poetic'    },
];

/* ─── Component ──────────────────────────────────────────────── */

export default function CreationSuite() {
  const [contentType,            setContentType]            = useState<ContentType>('generate');
  const [theme,                  setTheme]                  = useState<ContentTheme>('dawah');
  const [language,               setLanguage]               = useState<Language>('indonesia');
  const [tone,                   setTone]                   = useState<Tone>('inspiring');
  const [topic,                  setTopic]                  = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);

  const router = useRouter();
  const { generate, isLoading, error, reset } = useGenerate();

  const buildRequest = (): GenerateRequest => ({
    contentType,
    theme,
    language,
    tone,
    topic: topic.trim(),
    additionalInstructions: additionalInstructions.trim() || undefined,
  });

  const handleGenerate = async () => { 
    if (topic.trim()) {
      const success = await generate(buildRequest());
      if (success) {
        router.push(`/preview`);
      }
    } 
  };
  const handleRegenerate = async () => { 
    if (topic.trim()) {
      const success = await generate(buildRequest());
      if (success) {
        router.push(`/preview`);
      }
    }
  };

  const handleSuggestTopic = async () => {
    setIsGeneratingTopic(true);
    try {
      const res = await fetch('/api/suggest-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, language, tone }),
      });
      const data = await res.json();
      if (data.topic) setTopic(data.topic);
    } catch (e) {
      console.error('Failed to generate topic idea');
    } finally {
      setIsGeneratingTopic(false);
    }
  };

  return (
    <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-stack-md flex flex-col gap-stack-md"
      style={{ boxShadow: '0 4px 20px rgba(6,78,59,0.03)' }}>

      {/* Heading */}
      <div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">
          Creation Suite
        </h1>
        <p className="text-on-surface-variant font-body-md text-body-md">
          Design and generate purposeful Islamic content.
        </p>
      </div>


      {/* Content Type */}
      <div className="flex flex-col gap-2">
        <label className="font-label-md text-label-md text-on-surface">Content Type</label>
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map((t) => {
            const isActive = contentType === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setContentType(t.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-label-md text-label-md cursor-pointer transition-colors border
                  ${isActive
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-surface-container border-outline-variant/50 text-on-surface-variant hover:border-primary/50'
                  }`}
              >
                <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme & Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
        <div className="flex flex-col gap-2">
          <label htmlFor="select-theme" className="font-label-md text-label-md text-on-surface">
            Content Theme
          </label>
          <CustomSelect<ContentTheme>
            id="select-theme"
            value={theme}
            options={THEMES}
            onChange={setTheme}
            disabled={topic.trim().length > 0}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="select-language" className="font-label-md text-label-md text-on-surface">
            Language
          </label>
          <CustomSelect<Language>
            id="select-language"
            value={language}
            options={LANGUAGES}
            onChange={setLanguage}
          />
        </div>
      </div>

      {/* Tone */}
      <div className="flex flex-col gap-2">
        <label className="font-label-md text-label-md text-on-surface">Voice &amp; Tone</label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => {
            const isActive = tone === t.value;
            return (
              <button
                key={t.value}
                id={`tone-${t.value}`}
                type="button"
                onClick={() => setTone(t.value)}
                className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm cursor-pointer transition-colors border
                  ${isActive
                    ? 'bg-[#FEF3C7] border-[#D97706] text-[#92400E]'
                    : 'bg-surface-container border-outline-variant/50 text-on-surface-variant hover:border-primary/50'
                  }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="input-topic" className="font-label-md text-label-md text-on-surface">
            {contentType === 'generate' ? 'Specific Topic' : 'Text to Refine'}
          </label>
          {contentType === 'generate' && (
            <button
              type="button"
              onClick={handleSuggestTopic}
              disabled={isGeneratingTopic}
              className="flex items-center gap-1 font-label-sm text-label-sm text-secondary hover:text-secondary-container transition-colors disabled:opacity-50"
            >
              {isGeneratingTopic ? (
                <span className="w-3 h-3 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[14px]">lightbulb</span>
              )}
              Generate Idea ✨
            </button>
          )}
        </div>
        {contentType === 'generate' ? (
          <input
            id="input-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Keutamaan Sabar dalam menghadapi cobaan..."
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
          />
        ) : (
          <textarea
            id="input-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Paste your existing text or notes here..."
            rows={6}
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow resize-y"
          />
        )}
      </div>

      {/* Additional instructions */}
      <div className="flex flex-col gap-2">
        <label htmlFor="input-additional" className="font-label-md text-label-md text-on-surface">
          Additional Instructions{' '}
          <span className="text-on-surface-variant font-normal">(Optional)</span>
        </label>
        <textarea
          id="input-additional"
          value={additionalInstructions}
          onChange={(e) => setAdditionalInstructions(e.target.value)}
          placeholder="e.g., Include specific verses from Al-Baqarah, keep it under 3 paragraphs..."
          rows={3}
          className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-lg bg-error-container border border-error/20 animate-fade-in">
          <p className="text-sm font-semibold text-on-error-container">Failed to generate content</p>
          <p className="text-xs text-on-error-container/70 mt-1">{error}</p>
        </div>
      )}

      {/* Loading shimmer */}
      {isLoading && (
        <div className="space-y-3 animate-fade-in">
          <div className="h-4 rounded shimmer" />
          <div className="h-4 rounded shimmer w-5/6" />
          <div className="h-4 rounded shimmer w-4/6" />
          <div className="h-4 rounded shimmer w-5/6" />
          <div className="h-4 rounded shimmer w-3/6" />
        </div>
      )}

      {/* Removed inline result preview */}

      {/* Generate button */}
      <div className="mt-4 pt-4 border-t border-outline-variant/20 flex justify-end">
        <button
          id="btn-generate"
          type="button"
          onClick={handleGenerate}
          disabled={isLoading || !topic.trim()}
          className="w-full md:w-auto bg-primary text-on-primary px-8 py-3 rounded-full font-label-md text-label-md hover:bg-primary-container transition-colors duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                auto_awesome
              </span>
              Generate Content
            </>
          )}
        </button>
      </div>
    </div>
  );
}
