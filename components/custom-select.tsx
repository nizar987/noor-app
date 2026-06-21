'use client';

import { useState, useRef, useEffect } from 'react';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface CustomSelectProps<T extends string> {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  label?: string;
  id?: string;
}

export default function CustomSelect<T extends string>({
  value,
  options,
  onChange,
  id,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-surface-container-low border rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface transition-all outline-none
          ${isOpen ? 'border-primary ring-1 ring-primary' : 'border-outline-variant/50'}`}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <span
          className="material-symbols-outlined text-outline transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg shadow-lg overflow-hidden py-1">
          <ul className="max-h-60 overflow-y-auto">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 font-body-md text-body-md transition-colors hover:bg-primary/5
                      ${isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-on-surface'}`}
                  >
                    {opt.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
