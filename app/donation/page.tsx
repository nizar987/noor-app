'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import Link from 'next/link';

export default function DonationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <style>{`
        .pattern-bg-donation {
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23064e3b' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .radial-glow-donation {
            background: radial-gradient(circle at center, rgba(6, 78, 59, 0.05) 0%, rgba(248, 249, 250, 0) 70%);
        }
      `}</style>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-stack-lg radial-glow-donation pattern-bg-donation">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto flex flex-col items-center gap-stack-md pt-8">
          <span className="material-symbols-outlined text-[48px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          <h1 className="font-display-lg text-display-lg text-primary">Dukung Dakwah Digital Bersama Noor AI</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Bantuan Anda membantu kami menyediakan teknologi terbaik untuk menyebarkan hikmah dan ilmu.</p>
        </section>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Cards Section (Why Donate) */}
          <div className="md:col-span-7 flex flex-col gap-stack-md">
            <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-surface-variant shadow-[0_4px_20px_rgba(6,78,59,0.02)] hover:shadow-[0_4px_20px_rgba(6,78,59,0.05)] transition-shadow">
              <div className="flex items-start gap-stack-sm">
                <div className="p-3 bg-secondary-fixed/20 rounded-full">
                  <span className="material-symbols-outlined text-secondary">dns</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-2">Server &amp; AI Infrastructure</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Memastikan Noor AI selalu cepat, responsif, dan mampu melayani ribuan pengguna setiap hari tanpa henti.</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-surface-variant shadow-[0_4px_20px_rgba(6,78,59,0.02)] hover:shadow-[0_4px_20px_rgba(6,78,59,0.05)] transition-shadow">
              <div className="flex items-start gap-stack-sm">
                <div className="p-3 bg-secondary-fixed/20 rounded-full">
                  <span className="material-symbols-outlined text-secondary">language</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-2">Modern Dawah Expansion</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Mengembangkan fitur baru dan menterjemahkan kebaikan ke dalam lebih banyak bahasa dan format digital.</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-surface-variant shadow-[0_4px_20px_rgba(6,78,59,0.02)] hover:shadow-[0_4px_20px_rgba(6,78,59,0.05)] transition-shadow">
              <div className="flex items-start gap-stack-sm">
                <div className="p-3 bg-secondary-fixed/20 rounded-full">
                  <span className="material-symbols-outlined text-secondary">groups</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-2">Community Support</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Memberikan akses gratis ke teknologi AI canggih bagi pendidik, santri, dan pencari ilmu di seluruh dunia.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Area (QR Code) */}
          <div className="md:col-span-5 flex flex-col gap-stack-md">
            <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-primary-container/20 shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex flex-col items-center text-center relative overflow-hidden h-full">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
              <h2 className="font-headline-md text-headline-md text-primary mb-2 mt-4">Sedekah Jariyah</h2>
              <p className="font-body-md text-body-md text-on-surface-variant italic mb-stack-md">&quot;Ilmu yang bermanfaat adalah salah satu pahala yang tidak terputus.&quot;</p>
              
              <div 
                className="w-full max-w-[240px] aspect-square bg-surface-container-low rounded-xl p-4 mb-stack-sm border border-surface-variant cursor-pointer hover:shadow-[0_4px_20px_rgba(6,78,59,0.1)] transition-shadow group relative"
                onClick={() => setIsModalOpen(true)}
                title="Klik untuk memperbesar gambar"
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5 rounded-xl transition-opacity">
                  <span className="material-symbols-outlined text-primary bg-surface/80 p-2 rounded-full shadow-sm backdrop-blur-sm">zoom_in</span>
                </div>
                <img 
                  alt="QR Code for Donation" 
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.02] transition-transform" 
                  src="/asset/img/donation-qr.jpeg"
                />
              </div>
              
              <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">Scan QR Code di bawah untuk berdonasi melalui e-wallet (GoPay, OVO, Dana) atau Mobile Banking.</p>
              
              <div className="w-full pt-stack-sm border-t border-outline-variant/30 flex flex-wrap justify-center gap-4 opacity-70 mt-auto">
                <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span> GoPay
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">account_balance</span> OVO
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">payments</span> Dana
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">phone_iphone</span> Mobile Banking
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-tertiary w-full py-stack-lg mt-auto border-t border-surface-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-base">
          <div className="font-headline-md text-headline-md text-primary dark:text-primary-fixed">Noor AI</div>
          <div className="font-label-md text-label-md text-on-surface-variant dark:text-on-tertiary-container opacity-80 hover:opacity-100 transition-opacity">
            © 2024 Noor AI. Ancient Wisdom, Modern Tech.
          </div>
          <div className="flex gap-gutter font-label-md text-label-md">
            <a className="text-on-surface-variant dark:text-on-tertiary-container hover:text-secondary dark:hover:text-secondary-fixed transition-colors" href="#">Terms</a>
            <a className="text-on-surface-variant dark:text-on-tertiary-container hover:text-secondary dark:hover:text-secondary-fixed transition-colors" href="#">Privacy</a>
            <a className="text-on-surface-variant dark:text-on-tertiary-container hover:text-secondary dark:hover:text-secondary-fixed transition-colors" href="#">Help</a>
          </div>
        </div>
      </footer>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-surface rounded-2xl shadow-xl max-w-lg w-full p-4 relative flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors z-10 bg-surface/50 rounded-full p-1 flex items-center justify-center"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="w-full aspect-square bg-white rounded-xl overflow-hidden relative p-4 flex items-center justify-center">
              <img 
                src="/asset/img/donation-qr.jpeg" 
                alt="Donation QR Code Full" 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="font-body-sm text-on-surface-variant mt-4 text-center">
              Scan QR code di atas menggunakan aplikasi e-wallet atau mobile banking Anda.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
