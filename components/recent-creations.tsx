'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HistoryEntry } from '@/types';
import { getHistory, deleteFromHistory } from '@/lib/history';

const PLATFORM_ICONS: Record<string, string> = {
  instagram: 'camera_alt',
  tiktok:    'video_library',
  facebook:  'thumb_up',
  twitter:   'chat',
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  tiktok:    'TikTok Script',
  facebook:  'Facebook',
  twitter:   'Twitter',
};

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1)  return 'Just now';
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7)  return `${days} days ago`;
  return new Date(isoDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

interface RecentCreationsProps {
  limit?: number;
  onSelect?: (entry: HistoryEntry) => void;
}

export default function RecentCreations({ limit = 5, onSelect }: RecentCreationsProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const router = useRouter();

  const loadHistory = () => setHistory(getHistory().slice(0, limit));

  useEffect(() => {
    loadHistory();
    window.addEventListener('storage', loadHistory);
    return () => window.removeEventListener('storage', loadHistory);
  }, [limit]);

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="material-symbols-outlined text-[40px] text-outline mb-2 block">edit_note</span>
        <p className="font-body-md text-[14px] text-on-surface-variant">No creations yet</p>
        <p className="font-label-sm text-label-sm text-outline mt-1">Your content will appear here</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {history.map((entry) => (
        <div
          key={entry.id}
          onClick={() => {
            if (onSelect) onSelect(entry);
            else router.push('/history');
          }}
          className={`p-3 border border-outline-variant/30 rounded-lg hover:shadow-sm transition-shadow group cursor-pointer`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">
                {PLATFORM_ICONS[entry.platform] ?? 'article'}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                {PLATFORM_LABELS[entry.platform] ?? entry.platform}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteFromHistory(entry.id);
                loadHistory();
              }}
              className="opacity-0 group-hover:opacity-100 text-outline hover:text-error transition-all text-xs p-1"
              title="Delete"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors truncate">
            {entry.topic}
          </h3>
          <p className="font-body-md text-[13px] text-on-surface-variant truncate mt-1">
            {entry.content}
          </p>
          <div className="mt-2 text-[11px] text-outline">{timeAgo(entry.createdAt)}</div>
        </div>
      ))}

      {history.length >= limit && (
        <Link
          href="/history"
          className="text-center font-label-sm text-label-sm text-secondary hover:underline py-1"
        >
          View All
        </Link>
      )}
    </div>
  );
}
