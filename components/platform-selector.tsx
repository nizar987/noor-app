'use client';

import { Platform } from '@/types';

const PLATFORMS: {
  id: Platform;
  label: string;
  icon: string;
}[] = [
  { id: 'instagram', label: 'Instagram', icon: 'camera_alt'    },
  { id: 'tiktok',    label: 'TikTok',    icon: 'video_library' },
  { id: 'facebook',  label: 'Facebook',  icon: 'thumb_up'      },
  { id: 'twitter',   label: 'Twitter',   icon: 'chat'          },
];

interface PlatformSelectorProps {
  value: Platform;
  onChange: (platform: Platform) => void;
}

export default function PlatformSelector({ value, onChange }: PlatformSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-label-md text-label-md text-on-surface">Target Platform</label>
      <div className="flex flex-wrap gap-3">
        {PLATFORMS.map((p) => {
          const isActive = value === p.id;
          return (
            <button
              key={p.id}
              id={`platform-${p.id}`}
              type="button"
              onClick={() => onChange(p.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors font-body-md text-body-md
                ${isActive
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">{p.icon}</span>
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
