'use client';

import { useState } from 'react';
import { GenerateResult } from '@/types';

interface ContentPreviewProps {
  result: GenerateResult;
  onRegenerate?: () => void;
  onReset?: () => void;
}


const THEME_LABELS: Record<string, string> = {
  dawah: "Da'wah",
  tauhid: 'Tauhid',
  tafsir: 'Quranic Reflection',
  hadith: 'Hadith',
  fiqh: 'Fiqh',
  sirah: 'History',
  motivasi: 'Motivational',
};

export default function ContentPreview({ result, onRegenerate, onReset }: ContentPreviewProps) {
  const [copied, setCopied] = useState(false);

  const cleanContent = (text: string) => {
    return text.replace(/(^|\n)>\s?/g, '$1');
  };

  const processedContent = cleanContent(result.content);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(processedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="italic">{part.slice(1, -1)}</em>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in">

      {/* Meta badges */}
      <div className="flex items-center gap-2 flex-wrap">

        <span className="px-3 py-1 rounded-full bg-surface-container border border-outline-variant/50 text-on-surface-variant font-label-sm text-label-sm">
          {THEME_LABELS[result.theme]}
        </span>
        <span className="px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#D97706] text-[#92400E] font-label-sm text-label-sm capitalize">
          {result.tone}
        </span>
      </div>

      {/* AI disclaimer */}
      <div className="p-3 rounded-lg bg-[#FEF3C7] border border-[#D97706]/30 flex gap-2">
        <span className="material-symbols-outlined text-[18px] text-[#D97706] flex-shrink-0">warning</span>
        <p className="text-[13px] text-[#92400E]">
          Please verify Hadith and Quranic references before publishing. AI may occasionally cite inaccurate sources.
        </p>
      </div>

      {/* Generated content */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-4 font-body-md text-body-md text-on-surface whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
        {renderFormattedText(processedContent)}
      </div>

      {/* Topic & Instructions info */}
      <div className="flex flex-col gap-1">
        <p className="text-[12px] text-outline">
          Topic: <span className="text-on-surface-variant">{result.topic}</span>
        </p>
        {result.additionalInstructions && (
          <p className="text-[12px] text-outline">
            Instructions: <span className="text-on-surface-variant">{result.additionalInstructions}</span>
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          id="btn-copy-content"
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-label-md text-label-md border transition-colors duration-200
            ${copied
              ? 'bg-primary text-on-primary border-primary'
              : 'border-primary text-primary hover:bg-primary/5'
            }`}
        >
          <span className="material-symbols-outlined text-[16px]">{copied ? 'check' : 'content_copy'}</span>
          {copied ? 'Copied!' : 'Copy Content'}
        </button>

        {onRegenerate && (
          <button
            id="btn-regenerate"
            onClick={onRegenerate}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-label-md text-label-md border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Regenerate
          </button>
        )}

        {onReset && (
          <button
            id="btn-reset"
            onClick={onReset}
            className="font-label-sm text-label-sm text-outline hover:text-on-surface-variant transition-colors"
          >
            ← New Creation
          </button>
        )}
      </div>
    </div>
  );
}
