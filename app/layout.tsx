import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dashboard - Noor AI',
  description:
    "Generate high-quality Islamic content for social media using AI. Create da'wah posts, tafsir content, hadith highlights, and more — in seconds.",
  keywords: ['Islamic content', 'AI', 'dakwah', 'Muslim', 'content generator'],
  authors: [{ name: 'Noor AI' }],
  openGraph: {
    title: 'Noor AI — Islamic Content Generator',
    description: 'Generate high-quality Islamic content for social media using AI.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google Fonts: Inter + Playfair Display */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols Outlined */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col geometric-bg">
        {children}
      </body>
    </html>
  );
}
