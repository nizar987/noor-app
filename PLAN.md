# Noor AI — Plan Pengembangan

> Islamic content generation app berbasis 9router (OpenAI-compatible) dengan model Combos.

---

## 1. Overview Produk

**Noor AI** adalah web app untuk membuat konten dakwah Islam secara otomatis menggunakan LLM. User memilih platform target, tema, bahasa, tone, dan topik — lalu AI menghasilkan konten siap posting.

**Stack yang digunakan:**
- Frontend: Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- LLM Backend: 9router (OpenAI-compatible endpoint) dengan model Combos
- Database: Supabase (PostgreSQL) — untuk menyimpan history creations
- Auth: NextAuth.js
- Deployment: Vercel (frontend) + VPS/Railway (9router instance)

---

## 2. Fitur Utama

### 2.1 Creation Suite (Core)
- Pilih **Target Platform**: Instagram, TikTok, Facebook, Twitter
- Pilih **Content Theme**: Da'wah, Tafsir, Hadith, Fiqh, Sirah, Motivasi Islam
- Pilih **Language**: Indonesia, English, Arabic
- Pilih **Voice & Tone**: Inspiring, Academic, Friendly, Urgent, Poetic
- Input **Specific Topic** (free text)
- Input **Additional Instructions** (opsional)
- Tombol **Generate Content** → memanggil 9router API

### 2.2 Preview
- Tampilkan hasil generate dalam format preview per platform
- Copy to clipboard
- Regenerate dengan setting yang sama

### 2.3 History
- Simpan semua hasil generate ke database
- Filter by platform, tanggal, tema
- Delete / re-generate dari history


---

## 3. Arsitektur Teknis

```
User Browser
    │
    ▼
Next.js App (Vercel)
    │
    ├── /app/dashboard     → Creation Suite UI
    ├── /app/preview       → Preview hasil konten
    ├── /app/history       → Riwayat konten
    │
    └── /api/generate      → API Route (server-side)
            │
            ▼
        9router Instance
        (localhost:20128 / VPS)
            │
            ▼
        Combo Model
        (auto-fallback antar provider)
```

### API Route `/api/generate`

```typescript
// POST /api/generate
// Body:
{
  platform: "instagram" | "tiktok" | "facebook" | "twitter",
  theme: string,
  language: "indonesia" | "english" | "arabic",
  tone: "inspiring" | "academic" | "friendly" | "urgent" | "poetic",
  topic: string,
  additionalInstructions?: string,
  // Config dari .env
  baseUrl: string,       // 9router base URL
  apiKey: string,        // 9router API key
  comboName: string      // nama combo di 9router
}
```

### Pemanggilan 9router

```typescript
const response = await fetch(`${baseUrl}/v1/chat/completions`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    model: `combo/${comboName}`,  // e.g. "combo/dakwah-combo"
    messages: [
      { role: "system", content: buildSystemPrompt(platform, language) },
      { role: "user", content: buildUserPrompt(theme, tone, topic, additionalInstructions) }
    ],
    max_tokens: 1000,
    stream: false
  })
})
```

---

## 4. Prompt Engineering

### System Prompt Template

```
Kamu adalah asisten pembuatan konten Islam yang ahli untuk platform {platform}.
Buat konten dalam bahasa {language} dengan gaya {tone}.
Pastikan konten akurat secara syar'i, referensi hadits/quran harus shahih.
Format output sesuai platform: {platform_specific_format}.
```

### Platform-specific Format
- **Instagram**: Caption + hashtag (max 2200 karakter)
- **TikTok**: Script video 60-90 detik + hook opening
- **Facebook**: Post panjang + call to action
- **Twitter/X**: Thread (1-5 tweet, max 280 karakter per tweet)

---

## 5. Database Schema (Supabase)

```sql
-- Table: creations
CREATE TABLE creations (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     TEXT NOT NULL,
  platform    TEXT NOT NULL,
  theme       TEXT NOT NULL,
  language    TEXT NOT NULL,
  tone        TEXT NOT NULL,
  topic       TEXT NOT NULL,
  content     TEXT NOT NULL,
  combo_used  TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk filter history
CREATE INDEX idx_creations_user_platform ON creations(user_id, platform);
CREATE INDEX idx_creations_created_at ON creations(created_at DESC);
```

---

## 6. Struktur Folder Project

```
noor-ai/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Creation Suite
│   ├── preview/
│   │   └── page.tsx          # Preview hasil
│   ├── history/
│   │   └── page.tsx          # Riwayat
│   └── api/
│       └── generate/
│           └── route.ts      # API Route ke 9router
├── components/
│   ├── creation-suite.tsx    # Form utama
│   ├── platform-selector.tsx # Toggle platform
│   ├── content-preview.tsx   # Tampilan hasil
│   ├── recent-creations.tsx  # Sidebar history
├── lib/
│   ├── 9router.ts            # Helper fungsi panggil 9router
│   ├── prompt-builder.ts     # Builder system/user prompt
│   └── supabase.ts           # Supabase client
├── hooks/
│   └── use-generate.ts       # Custom hook untuk generate
├── types/
│   └── index.ts              # TypeScript types
├── .env.local                # Environment variables
└── README.md
```

---

## 7. Environment Variables

```env
# 9router (bisa dioverride via Settings UI)
NOOR_9ROUTER_BASE_URL=http://localhost:20128
NOOR_9ROUTER_API_KEY=your-api-key-from-dashboard
NOOR_9ROUTER_COMBO_NAME=your-combo-name

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=xxx
CLERK_SECRET_KEY=xxx
```

---

## 8. Roadmap Pengembangan

### Phase 1 — MVP (2 minggu)
- [x] Setup Next.js + Tailwind + shadcn/ui
- [ ] UI Creation Suite (clone dari desain Noor AI)
- [ ] Integrasi 9router API dengan model Combo
- [ ] Preview hasil konten
- [ ] Simpan ke localStorage (sementara, tanpa DB)

### Phase 2 — Database & Auth (1 minggu)
- [ ] Setup Supabase
- [ ] Integrasi Clerk auth
- [ ] History page dengan filter

### Phase 3 — Polish (1 minggu)
- [ ] Streaming response (real-time typing effect)
- [ ] Copy to clipboard per platform
- [ ] Export konten ke .txt / .docx
- [ ] Mobile responsive

### Phase 4 — Advanced (opsional)
- [ ] Scheduling konten (integrasi Postiz)
- [ ] Multi-language support (Arabic RTL)
- [ ] Analytics per konten
- [ ] Fitur donasi (Donasi button di navbar)

---

## 9. Catatan Penting

1. **9router harus running** sebelum app bisa generate — pastikan instance 9router accessible dari server Next.js
2. **Combo name** harus sudah dibuat di 9router dashboard sebelum dipakai
3. **Konten Islam** harus diverifikasi manual — AI bisa salah dalam referensi hadits, tambahkan disclaimer di UI
4. **Rate limit** tergantung provider di dalam combo — 9router handle auto-fallback otomatis
5. **CORS** — panggil 9router dari server-side (API Route), bukan dari browser langsung

---

*Dokumen ini bisa diupdate seiring perkembangan project.*
