# Vibe Coding Backend API

Backend service modern dan berkinerja tinggi menggunakan **Bun**, framework **ElysiaJS**, ORM **Drizzle**, dan database **MySQL**.

---

## 🛠️ Tech Stack
- **Runtime**: [Bun](https://bun.sh/)
- **Web Framework**: [ElysiaJS](https://elysiajs.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database Driver**: `mysql2`
- **Database**: MySQL Server 8.0+

---

## 📁 Struktur Folder
```text
.
├── src/
│   ├── db/
│   │   ├── index.ts              # Inisialisasi pool MySQL & Drizzle instance
│   │   └── schema/
│   │       ├── index.ts          # Export seluruh schema
│   │       └── users.ts          # Definisi tabel users
│   ├── routes/
│   │   └── user.routes.ts        # Router CRUD users (/api/users)
│   └── index.ts                  # Entrypoint utama server ElysiaJS
├── drizzle/                      # File migrasi SQL hasil generate Drizzle Kit
├── drizzle.config.ts             # Konfigurasi Drizzle Kit
├── .env.example                  # Template environment variables
├── .env                          # Konfigurasi lokal (abaikan di git)
├── package.json
└── README.md
```

---

## 🚀 Panduan Memulai

### 1. Instalasi Dependensi
Pastikan Bun sudah terpasang. Jalankan:
```bash
bun install
```

### 2. Konfigurasi Environment (`.env`)
Salin file `.env.example` ke `.env` lalu sesuaikan kredensial MySQL Anda:
```env
PORT=3000

# Konfigurasi Database MySQL
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=password_mysql_anda
DATABASE_NAME=vibe_coding_db
```

> **Catatan**: Buat database MySQL terlebih dahulu di instance Anda jika belum ada:
> ```sql
> CREATE DATABASE IF NOT EXISTS vibe_coding_db;
> ```

### 3. Migrasi Database
Untuk menghasilkan (generate) file migrasi SQL:
```bash
bun run db:generate
```

Untuk menerapkan (push) schema langsung ke database MySQL:
```bash
bun run db:push
```

Untuk membuka Drizzle Studio UI:
```bash
bun run db:studio
```

### 4. Menjalankan Server
Mode Development (auto-reload saat ada perubahan kode):
```bash
bun run dev
```

Mode Production:
```bash
bun run start
```

---

## 📡 Daftar Endpoint API

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/` | Pesan selamat datang & info endpoint |
| `GET` | `/health` | Status kesehatan server & uptime |
| `GET` | `/api/users` | Mengambil seluruh daftar pengguna dari database |
| `POST` | `/api/users` | Menambahkan pengguna baru (`name`, `email`) |
| `GET` | `/api/users/:id` | Mengambil detail pengguna berdasarkan ID |

### Contoh Request:
**Health Check:**
```bash
curl http://localhost:3000/health
```

**Tambah Pengguna Baru:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Dimas Aditya", "email": "dimas@example.com"}'
```

**Ambil Semua Pengguna:**
```bash
curl http://localhost:3000/api/users
```
