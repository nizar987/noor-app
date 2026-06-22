import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donasi - Noor AI',
  description: 'Dukung Dakwah Digital Bersama Noor AI',
};

export default function DonationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
