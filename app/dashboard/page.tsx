import type { Metadata } from 'next';
import Navbar from '@/components/navbar';
import CreationSuite from '@/components/creation-suite';
import RecentCreations from '@/components/recent-creations';

export const metadata: Metadata = {
  title: 'Dashboard - Noor AI',
  description: "Design and generate purposeful Islamic content for social media.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main */}
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg grid grid-cols-1 lg:grid-cols-12 gap-gutter">

        {/* Creation Suite — left 8 cols */}
        <CreationSuite />

        {/* Sidebar — right 4 cols */}
        <aside className="lg:col-span-4 flex flex-col gap-stack-md">

          {/* Recent Creations card */}
          <div
            className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-stack-md"
            style={{ boxShadow: '0 4px 20px rgba(6,78,59,0.03)' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-headline-md text-headline-md text-primary">Recent Creations</h2>
              <a href="/history" className="text-secondary font-label-sm text-label-sm hover:underline">
                View All
              </a>
            </div>
            <RecentCreations limit={3} />
          </div>

          {/* Pro Tip card */}
          <div className="bg-primary-fixed-dim/20 rounded-xl border border-primary/20 p-stack-md flex flex-col items-center text-center relative overflow-hidden">
            {/* decorative icon */}
            <span
              className="material-symbols-outlined text-[48px] text-primary/20 absolute -bottom-4 -right-4"
              aria-hidden="true"
            >
              lightbulb
            </span>
            <span
              className="material-symbols-outlined text-secondary mb-2"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              auto_awesome
            </span>
            <h4 className="font-label-md text-label-md text-primary mb-1">Pro Tip</h4>
            <p className="font-body-md text-[14px] text-on-surface-variant">
              Be specific with your instructions. Mentioning authentic Hadith references helps generate more
              credible content.
            </p>
          </div>

          {/* Promotion Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 p-stack-md flex flex-col items-center text-center">
            <span
              className="material-symbols-outlined text-indigo-500 mb-2"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              campaign
            </span>
            <h4 className="font-label-md text-label-md text-indigo-900 dark:text-indigo-200 mb-1">Special Offer</h4>
            <p className="font-body-md text-[14px] text-indigo-800/80 dark:text-indigo-300/80 mb-4">
              Get an exclusive <strong>20% discount</strong> on Hostinger web hosting when you sign up using our referral link.
            </p>
            <a
              href="https://www.hostinger.com/id?REFERRALCODE=AGPNIZARAMRT"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-label-md text-label-md py-2 px-6 rounded-full transition-colors w-full sm:w-auto"
            >
              Claim 20% Discount
            </a>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="flex flex-col md:flex-row justify-between items-center py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="mb-4 md:mb-0">
            <span className="font-display-lg text-label-md text-primary">Noor AI</span>
            <p className="text-on-surface-variant font-label-sm text-label-sm mt-1">
              © 2026 Noor AI. Crafted for Sacred Creation.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            {['Terms of Service', 'Privacy Policy', 'Help Center', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-on-surface-variant font-label-sm text-label-sm hover:text-secondary transition-colors opacity-80 hover:opacity-100"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
