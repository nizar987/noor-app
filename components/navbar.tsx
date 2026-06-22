'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/preview',   label: 'Preview'   },
  { href: '/history',   label: 'History'   },
  { href: '/settings',  label: 'Settings'  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handlePlaceholder = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Fitur ini akan segera hadir! (Coming soon)');
  };

  return (
    <header className="w-full top-0 sticky bg-surface shadow-sm z-50"
      style={{ boxShadow: '0 4px 20px rgba(6,78,59,0.05)' }}>
      <div className="flex justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-16">

        {/* Left: logo + nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="font-display-lg text-headline-md text-primary tracking-tight"
          >
            Noor AI
          </Link>
          <nav className="hidden md:flex gap-6 relative">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const isPlaceholder = link.href === '/preview' || link.href === '/settings';
              
              if (isPlaceholder) {
                return (
                  <button
                    key={link.label}
                    onClick={handlePlaceholder}
                    className="font-label-md text-label-md transition-colors duration-200 text-on-surface-variant hover:text-primary"
                  >
                    {link.label}
                  </button>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`font-label-md text-label-md transition-colors duration-200 relative pb-1
                    ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-[21px] left-0 right-0 h-[3px] bg-secondary rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <button
              id="btn-notifications"
              onClick={handlePlaceholder}
              className="p-2 hover:text-secondary-container transition-colors duration-200 rounded-full hover:bg-surface-variant"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              id="btn-account"
              onClick={handlePlaceholder}
              className="p-2 hover:text-secondary-container transition-colors duration-200 rounded-full hover:bg-surface-variant"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>

          <Link
            id="btn-donate"
            href="/donation"
            className="hidden md:flex items-center gap-2 border border-primary text-primary px-4 py-2 rounded-full font-label-md text-label-md hover:bg-primary/5 transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
            Donasi
          </Link>

          <Link
            id="btn-new-creation"
            href="/dashboard"
            onClick={(e) => {
              if (pathname === '/dashboard') {
                e.preventDefault();
                window.location.reload();
              }
            }}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:bg-primary-container transition-colors duration-200 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="hidden sm:inline">New Creation</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
