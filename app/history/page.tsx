'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import ContentPreview from '@/components/content-preview';
import CustomSelect from '@/components/custom-select';
import { HistoryEntry, Platform, ContentTheme } from '@/types';
import { getHistory, deleteFromHistory, clearHistory } from '@/lib/history';

const PLATFORM_OPTIONS = ['all', 'instagram', 'tiktok', 'facebook', 'twitter'] as const;
const THEME_OPTIONS = ['all', 'dawah', 'tafsir', 'hadith', 'fiqh', 'sirah', 'motivasi'] as const;

const PLATFORM_ICONS: Record<string, string> = {
  instagram: 'camera_alt',
  tiktok: 'video_library',
  facebook: 'thumb_up',
  twitter: 'chat',
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  twitter: 'Twitter',
};

const THEME_LABELS: Record<string, string> = {
  dawah: "Da'wah",
  tafsir: 'Quranic Reflection',
  hadith: 'Hadith',
  fiqh: 'Fiqh',
  sirah: 'History',
  motivasi: 'Motivational',
};

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function HistoryPage() {
  const [allHistory, setAllHistory] = useState<HistoryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<'all' | Platform>('all');
  const [filterTheme, setFilterTheme] = useState<'all' | ContentTheme>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadHistory = () => setAllHistory(getHistory());

  useEffect(() => { loadHistory(); }, []);

  const filtered = allHistory.filter((e) => {
    if (filterPlatform !== 'all' && e.platform !== filterPlatform) return false;
    if (filterTheme !== 'all' && e.theme !== filterTheme) return false;
    if (searchQuery && !e.topic.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleDelete = (id: string) => {
    deleteFromHistory(id);
    loadHistory();
    if (selectedEntry?.id === id) setSelectedEntry(null);
  };

  const handleClearAll = () => {
    if (!confirm('Delete all history? This cannot be undone.')) return;
    clearHistory();
    loadHistory();
    setSelectedEntry(null);
  };

  const inputCls = 'bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-stack-md">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              History
            </h1>
            <p className="text-on-surface-variant font-body-md text-body-md mt-1">
              {allHistory.length} creation{allHistory.length !== 1 ? 's' : ''} saved locally
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              New Creation
            </Link>
            {allHistory.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 border border-error/40 text-error px-4 py-2 rounded-full font-label-md text-label-md hover:bg-error/5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div
          className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 flex flex-wrap gap-3"
          style={{ boxShadow: '0 4px 20px rgba(6,78,59,0.03)' }}
        >
          <input
            id="search-history"
            type="text"
            placeholder="Search by topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputCls} flex-1 min-w-[180px]`}
          />
          <div className="w-[180px]">
            <CustomSelect<'all' | Platform>
              id="filter-platform"
              value={filterPlatform}
              onChange={setFilterPlatform}
              options={[
                { value: 'all', label: 'All Platforms' },
                ...PLATFORM_OPTIONS.filter(p => p !== 'all').map(p => ({ value: p, label: PLATFORM_LABELS[p] }))
              ]}
            />
          </div>
          <div className="w-[180px]">
            <CustomSelect<'all' | ContentTheme>
              id="filter-theme"
              value={filterTheme}
              onChange={setFilterTheme}
              options={[
                { value: 'all', label: 'All Themes' },
                ...THEME_OPTIONS.filter(t => t !== 'all').map(t => ({ value: t, label: THEME_LABELS[t] }))
              ]}
            />
          </div>
        </div>

        {/* Content */}
        {allHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-[56px] text-outline mb-4">edit_note</span>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2">No history yet</h2>
            <p className="text-on-surface-variant font-body-md text-body-md mb-6">
              Start creating Islamic content and it will appear here.
            </p>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md text-label-md hover:bg-primary-container transition-colors shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>auto_awesome</span>
              Create Content
            </Link>
          </div>

        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-[40px] text-outline mb-3">search</span>
            <p className="text-on-surface-variant font-body-md text-body-md">No content matches your filters</p>
          </div>

        ) : (
          <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
            {/* List */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </p>
              {filtered.map((entry) => {
                const isSelected = selectedEntry?.id === entry.id;
                return (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className={`p-3 border rounded-lg cursor-pointer hover:shadow-sm transition-all group
                      ${isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-outline-variant/30 bg-surface-container-lowest hover:border-primary/30'
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          {PLATFORM_ICONS[entry.platform] ?? 'article'}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                          {PLATFORM_LABELS[entry.platform]}
                        </span>
                        <span className="font-label-sm text-label-sm text-outline">· {THEME_LABELS[entry.theme]}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                        className="opacity-0 group-hover:opacity-100 text-outline hover:text-error transition-all"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                    <h3 className={`font-label-md text-label-md transition-colors truncate ${isSelected ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>
                      {entry.topic}
                    </h3>
                    <p className="font-body-md text-[12px] text-on-surface-variant line-clamp-2 mt-1">{entry.content}</p>
                    <div className="mt-2 text-[11px] text-outline">{timeAgo(entry.createdAt)}</div>
                  </div>
                );
              })}
            </div>

            {/* Preview */}
            <div className="lg:col-span-8">
              {selectedEntry ? (
                <div
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-stack-md sticky top-24"
                  style={{ boxShadow: '0 4px 20px rgba(6,78,59,0.03)' }}
                >
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-4">
                    Content Preview
                  </h3>
                  <ContentPreview result={selectedEntry} />
                </div>
              ) : (
                <div
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center flex flex-col items-center justify-center"
                  style={{ boxShadow: '0 4px 20px rgba(6,78,59,0.03)' }}
                >
                  <span className="material-symbols-outlined text-[40px] text-outline mb-3">article</span>
                  <p className="text-on-surface-variant font-body-md text-body-md">
                    Select a creation to preview it here
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="flex flex-col md:flex-row justify-between items-center py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <span className="font-display-lg text-label-md text-primary mb-2 md:mb-0">Noor AI</span>
          <p className="text-on-surface-variant font-label-sm text-label-sm">© 2026 Noor AI. Crafted for Sacred Creation.</p>
        </div>
      </footer>
    </div>
  );
}
