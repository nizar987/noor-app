import { HistoryEntry } from '@/types';

const STORAGE_KEY = 'noor-ai-history';

export function getHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveToHistory(entry: Omit<HistoryEntry, 'id'>): HistoryEntry {
  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
  };
  const history = getHistory();
  const updated = [newEntry, ...history].slice(0, 100); // keep last 100
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newEntry;
}

export function deleteFromHistory(id: string): void {
  const history = getHistory();
  const updated = history.filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
