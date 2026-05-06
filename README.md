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
- Isi nilai-nilai di dalam `.env` dengan value yang sama untuk semua anggota tim.
- Jangan commit file `.env` karena berisi secret.
- Kalau `DATABASE_URL` kosong/salah, halaman Explore bisa jatuh ke data dummy karena database gagal dibaca.
```bash
cp .env.example .env
```

Variable yang wajib diisi:
- `DATABASE_URL`: connection string PostgreSQL/Supabase yang dipakai project.
- `AUTH_SECRET`: secret untuk NextAuth. Semua device yang memakai database/auth yang sama sebaiknya memakai nilai yang sama.
- `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon key Supabase.

### 4. Setup Database (Prisma)
Jalankan setup berikut setelah `.env` diisi:
```bash
npm run db:setup
```

Command tersebut akan:
- Generate Prisma client ke folder `generated/prisma`.
- Sinkronkan schema Prisma ke database.
- Isi data awal resep dan ingredient secara aman/idempotent.

Jika hanya butuh menjalankan sebagian proses:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

Catatan: `generated/prisma` tidak ikut Git, jadi setiap device harus menjalankan `npm run db:generate` minimal sekali setelah install atau setelah schema berubah.

### 5. Jalankan Aplikasi
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🛠 Tech Stack
- **Framework:** Next.js 16 (App Router)
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
