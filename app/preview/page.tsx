'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import ContentPreview from '@/components/content-preview';
import { getCurrentPreview, saveCurrentPreview, getPendingGeneration, clearPendingGeneration, pingUserActive } from '@/lib/storage';
import { consumeStream } from '@/lib/client-stream';
import { GenerateResult } from '@/types';
import Link from 'next/link';

function PreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [entry, setEntry] = useState<GenerateResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a pending generation request to stream
    // The searchParams.get('t') dependency ensures this runs again if navigating to /preview?t=...
    const t = searchParams.get('t');
    const pendingRequest = getPendingGeneration();
    if (pendingRequest) {
      clearPendingGeneration();
      
      const initialEntry: GenerateResult = {
        content: '',
        theme: pendingRequest.theme,
        language: pendingRequest.language,
        tone: pendingRequest.tone,
        topic: pendingRequest.topic,
        additionalInstructions: pendingRequest.additionalInstructions,
        comboUsed: 'Generating...',
        createdAt: new Date().toISOString(),
      };
      
      setEntry(initialEntry);
      setIsLoading(false);

      fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingRequest),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to fetch stream');
          
          let finalContent = '';
          await consumeStream(res, (text) => {
            finalContent = text;
            setEntry((prev) => prev ? { ...prev, content: text } : null);
          });
          
          setEntry((current) => {
            if (current) {
              const finalResult = { ...current, content: finalContent, comboUsed: 'AI Generated' };
              saveCurrentPreview(finalResult);
              return finalResult;
            }
            return current;
          });
          pingUserActive();
        })
        .catch((err) => {
          console.error('Error streaming generation:', err);
        });
        
      return;
    }

    const preview = getCurrentPreview();
    if (preview) {
      setEntry(preview);
    }
    setIsLoading(false);
  }, [searchParams]);

  return (
    <div className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-stack-md">
      <div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">
          Preview
        </h1>
        <p className="text-on-surface-variant font-body-md text-body-md">
          Tinjau hasil generate konten Anda di sini.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-fade-in">
          <div className="h-4 rounded shimmer" />
          <div className="h-4 rounded shimmer w-5/6" />
          <div className="h-4 rounded shimmer w-4/6" />
        </div>
      ) : entry ? (
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-stack-md" style={{ boxShadow: '0 4px 20px rgba(6,78,59,0.03)' }}>
            <ContentPreview 
              result={entry} 
              onReset={() => router.push('/dashboard')}
            />
          </div>

          {/* Donation Banner */}
          <div 
            className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_4px_20px_rgba(6,78,59,0.02)] hover:shadow-[0_4px_25px_rgba(6,78,59,0.05)] transition-all duration-300 animate-fade-in relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.03) 0%, rgba(144, 77, 0, 0.02) 100%)' }}
          >
            {/* Subtle colored accent line on the left */}
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-primary to-secondary"></div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 z-10 pl-2">
              <div className="p-3 bg-[#ffdcc3] rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#904d00] text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
              </div>
              <div className="flex flex-col gap-1 text-left">
                <h3 className="font-headline-md text-[18px] md:text-[20px] text-primary">
                  Dukung Noor AI Tetap Gratis &amp; Cepat
                </h3>
                <p className="font-body-md text-[14px] text-on-surface-variant max-w-xl leading-relaxed">
                  Sedekah jariyah Anda membantu kami mendanai server AI dan menghadirkan lebih banyak fitur bermanfaat untuk umat.
                </p>
              </div>
            </div>
            
            <Link 
              href="/donation"
              className="shrink-0 bg-primary hover:bg-[#0b513d] text-on-primary font-label-md px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-sm hover:shadow duration-200 z-10 text-[14px]"
            >
              Donasi Sekarang
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-stack-lg text-center">
          <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">hourglass_empty</span>
          <h2 className="font-headline-md text-primary mb-2">Belum ada konten</h2>
          <p className="text-on-surface-variant mb-6">Anda belum membuat konten apa pun. Silakan kembali ke dashboard untuk membuat konten.</p>
          <button onClick={() => router.push('/dashboard')} className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md">
            Ke Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

export default function PreviewPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={<div className="flex-grow flex items-center justify-center">Loading...</div>}>
        <PreviewContent />
      </Suspense>

      <footer className="w-full mt-auto bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="flex flex-col md:flex-row justify-between items-center py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="mb-4 md:mb-0">
            <span className="font-display-lg text-label-md text-primary">Noor AI</span>
            <p className="text-on-surface-variant font-label-sm text-label-sm mt-1">
              © 2026 Noor AI. Crafted for Sacred Creation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
