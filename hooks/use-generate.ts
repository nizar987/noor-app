'use client';

import { useState, useCallback } from 'react';
import { GenerateRequest, GenerateResult } from '@/types';
import { saveCurrentPreview, pingUserActive } from '@/lib/storage';

interface UseGenerateReturn {
  generate: (request: GenerateRequest) => Promise<boolean>;
  result: GenerateResult | null;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useGenerate(): UseGenerateReturn {
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (request: GenerateRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const data = JSON.parse(errorText);
          throw new Error(data.error || 'Gagal generate konten');
        } catch (e) {
          if (e instanceof Error && e.message !== 'Unexpected end of JSON input') throw e;
          throw new Error(`Server returned HTML/Text: ${errorText.substring(0, 100)}...`);
        }
      }

      const data = await response.json();
      const generateResult: GenerateResult = {
        content: data.content,
        theme: request.theme,
        language: request.language,
        tone: request.tone,
        topic: request.topic,
        additionalInstructions: request.additionalInstructions,
        comboUsed: data.model || 'combo/unknown',
        createdAt: new Date().toISOString(),
      };

      setResult(generateResult);
      saveCurrentPreview(generateResult);
      pingUserActive();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { generate, result, isLoading, error, reset };
}
