# Recipeat - Recipe Management App

Selamat datang di proyek Recipeat! Proyek ini menggunakan Next.js, Prisma, dan Supabase.

## 🚀 Panduan Instalasi (Untuk Tim)

Ikuti langkah-langkah di bawah ini untuk menjalankan project di komputer lokal Anda:

### 1. Clone Repository
```bash
git clone [URL_REPOSITORY_ANDA]
cd recipeat
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment Variables
- Copy file `.env.example` menjadi `.env`
- Isi nilai-nilai di dalam `.env` (Minta isi `DATABASE_URL` dan `SUPABASE_KEY` kepada pemilik project)
```bash
cp .env.example .env
```

### 4. Setup Database (Prisma)
Generate Prisma client agar folder `generated/prisma` terbuat di komputer Anda:
```bash
npx prisma generate
```

Jika Anda ingin mensinkronkan database dengan schema terbaru (Opsional):
```bash
npx prisma db push
```

### 5. Jalankan Aplikasi
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🛠 Tech Stack
- **Framework:** Next.js 15+ (App Router)
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Auth:** NextAuth.js
- **Styling:** CSS Vanilla / Tailwind

## 📁 Struktur Folder Utama
- `app/`: Routing dan halaman aplikasi.
- `components/`: Komponen UI yang bisa digunakan kembali.
- `prisma/`: Schema database dan script seeding.
- `lib/`: Konfigurasi library (Prisma client, Supabase, Auth).

---
*Dibuat dengan ❤️ oleh Tim Recipeat*
