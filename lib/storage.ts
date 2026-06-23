import { GenerateResult } from '@/types';
import { getUserId } from './user-id';

const PREVIEW_STORAGE_KEY = 'noor_current_preview';

// ===== Preview Storage (Local only) =====
export function saveCurrentPreview(result: GenerateResult): void {
  if (typeof window === 'undefined') return;
  // Using sessionStorage so it survives reloads but clears when tab is closed
  sessionStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(result));
}

export function getCurrentPreview(): GenerateResult | null {
  if (typeof window === 'undefined') return null;
  const data = sessionStorage.getItem(PREVIEW_STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as GenerateResult;
  } catch (err) {
    console.error('Failed to parse preview data:', err);
    return null;
  }
}

export function clearCurrentPreview(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(PREVIEW_STORAGE_KEY);
}

// ===== User Storage (Vercel Blob) =====
export async function pingUserActive(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const userId = getUserId();
    if (!userId) return;
    
    // We don't await this because it's just a background ping
    fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
      body: JSON.stringify({ ping: true })
    }).catch(console.error);
  } catch (err) {
    console.error('Ping user error:', err);
  }
}
