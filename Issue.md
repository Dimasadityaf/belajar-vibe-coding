# Planning: Inisialisasi Project Backend (Bun + ElysiaJS + Drizzle + MySQL)

Dokumen ini berisi panduan high-level dan status pengerjaan untuk project backend baru pada repositori ini.

---

## 1. Overview & Tujuan Project
Membangun template/fondasi backend service modern, cepat, dan type-safe menggunakan ekosistem **Bun**, framework **ElysiaJS**, ORM **Drizzle**, dan database **MySQL**.

---

## 2. Tech Stack
- **Runtime & Package Manager**: [Bun](https://bun.sh/) (v1.4.3)
- **Web Framework**: [ElysiaJS](https://elysiajs.com/) (v1.4.30)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) (`drizzle-orm` v0.45.4, `drizzle-kit` v0.31.11)
- **Database Driver**: `mysql2` (v3.24.6)
- **Database**: MySQL Server 8.0+
- **Language**: TypeScript

---

## 3. High-Level Implementation Steps

### Phase 1: Inisialisasi Project & Dependensi
- [x] Inisialisasi project Bun di root folder (`bun init`).
- [x] Setup `tsconfig.json` yang sesuai dengan standar Bun dan Elysia.
- [x] Install dependensi utama:
  - `elysia`
  - `drizzle-orm`
  - `mysql2`
- [x] Install dependensi pengembangan (DevDependencies):
  - `drizzle-kit`
  - `@types/bun`
- [x] Buat file konfigurasi environment `.env` dan `.env.example` (memuat `PORT`, `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`, dll).
- [x] Setup `.gitignore` (mengabaikan `node_modules`, `.env`, dll).

### Phase 2: Struktur Direktori (High-Level Architecture)
Struktur folder modular di dalam `src/`:
```text
.
├── src/
│   ├── db/
│   │   ├── index.ts        # Inisialisasi koneksi MySQL pool & Drizzle instance
│   │   └── schema/         # Definisi tabel/schema database Drizzle
│   │       ├── index.ts
│   │       └── users.ts
│   ├── routes/             # Controller / Route endpoints Elysia
│   │   └── user.routes.ts
│   └── index.ts            # Entrypoint utama aplikasi Elysia
├── drizzle/                # Output migrasi database (dihasilkan drizzle-kit)
│   └── 0000_freezing_terror.sql
├── drizzle.config.ts       # Konfigurasi Drizzle Kit untuk migrasi & schema path
├── .env.example
├── .env
├── package.json
└── README.md
```

### Phase 3: Setup Database & Drizzle ORM
- [x] Buat konfigurasi koneksi database MySQL di `src/db/index.ts` menggunakan pool `mysql2/promise` dan Drizzle.
- [x] Buat schema tabel `users` di `src/db/schema/users.ts` dan diekspor via `src/db/schema/index.ts`.
- [x] Buat file `drizzle.config.ts` untuk mengarahkan schema path, database credentials, dan output migrasi.
- [x] Tambahkan scripts di `package.json` untuk manajemen database:
  - Generate migrasi (`bun run db:generate`)
  - Push schema (`bun run db:push`)
  - Drizzle Studio viewer (`bun run db:studio`)

### Phase 4: Setup ElysiaJS Server
- [x] Buat server instance Elysia di `src/index.ts`.
- [x] Buat endpoint dasar:
  - `GET /` untuk info layanan.
  - `GET /health` untuk health check & uptime.
- [x] Hubungkan router dengan modul database:
  - Buat router CRUD pengguna (`/api/users`) menggunakan Drizzle.
- [x] Tambahkan script runner di `package.json`:
  - `bun run dev` (`bun --watch src/index.ts`)
  - `bun run start` (`bun run src/index.ts`)

### Phase 5: Dokumentasi & Verifikasi
- [x] Buat `README.md` lengkap yang menjelaskan:
  - Cara instalasi dependensi
  - Setup `.env`
  - Perintah migrasi database
  - Cara menjalankan server
  - Daftar endpoint dan contoh `curl`
- [x] Lakukan verifikasi end-to-end:
  - Server dapat dinyalakan tanpa error.
  - Endpoint `/` dan `/health` teruji memberikan response JSON yang valid.
  - Typecheck (`bun check`) lolos 100% tanpa error.
  - `db:generate` berhasil membuat file migrasi SQL.

---

## 4. Kriteria Keberhasilan (Acceptance Criteria)
1. Project dapat dijalankan dengan perintah `bun run dev`. (Status: Berhasil)
2. Drizzle dapat membaca schema dan berhasil generate migrasi SQL. (Status: Berhasil)
3. ElysiaJS melayani request HTTP dan mengembalikan response JSON yang valid. (Status: Berhasil)
4. TypeScript bersih tanpa type error (`bun check` lolos). (Status: Berhasil)
5. Kode terstruktur modular dan siap dikembangkan lebih lanjut. (Status: Berhasil)
