# [TASK] Implementasi Fitur Registrasi Pengguna Baru (`POST /api/users`)

## 1. Ringkasan & Tujuan
Dokumen ini merupakan panduan implementasi teknis (**step-by-step issue**) untuk membuat fitur registrasi user baru pada backend berbasis **Bun + ElysiaJS + Drizzle ORM + MySQL**.

Target pelaksana: **Junior Programmer** atau **AI Model (Budget/Small LLM)**.
Instruksi dibuat sangat eksplisit, minim ambiguitas, dan dilengkapi contoh kode serta perintah yang dapat langsung dieksekusi.

---

## 2. Spesifikasi Teknis

### A. Skema Database (Tabel `users`)
Tabel `users` pada database MySQL harus memiliki spesifikasi kolom sebagai berikut:

| Nama Kolom   | Tipe Data      | Atribut / Constraint                                      | Keterangan |
| :---         | :---           | :---                                                      | :--- |
| `id`         | `INT`          | `AUTO_INCREMENT`, `PRIMARY KEY`                           | Identifier unik |
| `name`       | `VARCHAR(255)` | `NOT NULL`                                                | Nama lengkap user |
| `email`      | `VARCHAR(255)` | `NOT NULL`, `UNIQUE`                                      | Email (wajib unik agar tidak bisa duplikat) |
| `password`   | `VARCHAR(255)` | `NOT NULL`                                                | String hasil hash **bcrypt** (dilarang plain text!) |
| `created_at` | `TIMESTAMP`    | `DEFAULT CURRENT_TIMESTAMP`, `NOT NULL`                   | Waktu pembuatan user |

---

### B. Kontrak API (API Contract)

#### **Endpoint**: `POST /api/users`
Header: `Content-Type: application/json`

#### **Request Body**:
```json
{
  "name": "dimas",
  "email": "dimas@localhost",
  "password": "rahasia"
}
```

#### **Response Body (Sukses - HTTP 201 Created atau 200 OK)**:
```json
{
  "data": "OK"
}
```

#### **Response Body (Error: Email Sudah Terdaftar - HTTP 400 Bad Request)**:
```json
{
  "Error": "Email sudah terdaftar"
}
```

---

### C. Struktur Folder & Standar Penamaan File
Seluruh kode logic dan routing harus dipisahkan sesuai arsitektur modular berikut di dalam direktori `src/`:

```text
src/
├── db/
│   ├── index.ts                # Koneksi DB Drizzle & MySQL
│   └── schema/
│       ├── index.ts            # Export schema
│       └── users.ts            # Definisi schema tabel users
├── routes/
│   └── users-routes.ts         # Routing ElysiaJS
├── service/
│   └── users-service.ts        # Business logic: hash password, cek email, insert user
└── index.ts                    # Entrypoint aplikasi (mount router)
```

---

## 3. Langkah-Langkah Implementasi (Step-by-Step)

### Tahap 1: Update Schema Database Drizzle & Eksekusi Migrasi
1. Buka file `src/db/schema/users.ts`.
2. Tambahkan kolom `password` tipe `varchar("password", { length: 255 }).notNull()`.
3. Pastikan kolom `email` memiliki constraint `.unique()`.

### Tahap 2: Metode Hashing Password (Bcrypt)
Gunakan API native Bun:
```typescript
const hashedPassword = await Bun.password.hash(password, {
  algorithm: "bcrypt",
  cost: 10,
});
```

### Tahap 3: Buat Layer Service (`src/service/users-service.ts`)
Tulis logika bisnis untuk:
- Mencari apakah email sudah ada di database (`findUserByEmail`).
- Melakukan hashing password menggunakan bcrypt.
- Menyimpan data user baru ke database (`createUser`).

### Tahap 4: Buat Routing ElysiaJS (`src/routes/users-routes.ts`)
Definisikan endpoint `POST /` dengan prefix `/api/users`.

### Tahap 5: Daftarkan Route ke Main Entrypoint (`src/index.ts`)
Mount `usersRoutes` pada server Elysia di `src/index.ts`.

---

## 4. Panduan Verifikasi & Pengujian (Testing)

### Kasus Uji 1: Registrasi Pengguna Baru (Berhasil)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "dimas",
    "email": "dimas@localhost",
    "password": "rahasia"
  }'
```
Response: `{ "data": "OK" }`

### Kasus Uji 2: Registrasi Email Duplikat (Gagal)
Response: `{ "Error": "Email sudah terdaftar" }`

---

## 5. Checklist Penyelesaian (Definition of Done)
- [x] Skema tabel `users` telah memiliki kolom `id`, `name`, `email`, `password`, dan `created_at`.
- [x] Kolom `email` berstatus `UNIQUE`.
- [x] Migrasi Drizzle berhasil di-generate dan diterapkan ke database (`bun run db:push`).
- [x] Folder `src/service/` dibuat dan berisi file `users-service.ts`.
- [x] Password di-hash menggunakan algoritma **bcrypt** sebelum disimpan ke database.
- [x] Folder `src/routes/` berisi file `users-routes.ts`.
- [x] Endpoint `POST /api/users` mengembalikan `{ "data": "OK" }` jika sukses.
- [x] Endpoint `POST /api/users` mengembalikan `{ "Error": "Email sudah terdaftar" }` jika email sudah terdaftar.
- [x] File `src/index.ts` berhasil meng-import dan me-mount `usersRoutes`.
- [x] Seluruh kasus uji telah diuji dan lolos.
- [x] `bun run typecheck` lolos tanpa error.
