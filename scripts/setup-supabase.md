# Setup Supabase untuk Aplikasi Sikola

## Langkah-langkah Setup:

### 1. Buka Supabase Dashboard
- Login ke [supabase.com](https://supabase.com)
- Pilih project yang sudah ada atau buat project baru

### 2. Jalankan SQL Script

**Opsi A: Script Aman (Recommended)**
- Buka **SQL Editor** di Supabase Dashboard
- Copy dan paste isi file `scripts/seed-users.sql` (dengan ON CONFLICT)
- Klik **Run** untuk menjalankan script

**Opsi B: Reset dan Seed (Jika ada error)**
- Buka **SQL Editor** di Supabase Dashboard
- Copy dan paste isi file `scripts/reset-and-seed.sql`
- Klik **Run** untuk menjalankan script
- ⚠️ **PERINGATAN**: Script ini akan menghapus data yang ada!

### 3. Verifikasi Data
Setelah script berhasil dijalankan, periksa tabel berikut:

#### Tabel `auth.users`
```sql
SELECT id, email, email_confirmed_at FROM auth.users;
```

#### Tabel `profiles`
```sql
SELECT id, email, name, role, is_active FROM profiles;
```

#### Tabel `academic_years`
```sql
SELECT * FROM academic_years;
```

#### Tabel `institutions`
```sql
SELECT * FROM institutions;
```

### 4. Test Login
Gunakan credentials berikut untuk test login:

**Super Admin:**
- Email: `admin@sekolah.sch.id`
- Password: `admin123`

**Kasir:**
- Email: `kasir@sekolah.sch.id`
- Password: `kasir123`

### 5. Konfigurasi RLS (Row Level Security)
Pastikan RLS sudah dikonfigurasi dengan benar untuk tabel `profiles`:

```sql
-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

## Troubleshooting

### Jika ada error saat menjalankan script:
1. Pastikan extension `pgcrypto` sudah diaktifkan
2. Pastikan tidak ada data duplikat di tabel
3. Periksa constraint dan foreign key

### Jika login tidak berfungsi:
1. Periksa apakah user sudah terdaftar di `auth.users`
2. Periksa apakah profile sudah dibuat di `profiles`
3. Periksa apakah `is_active = true` di profile
4. Periksa console browser untuk error messages

## Data yang Akan Dibuat:

### Users:
- **Super Admin**: admin@sekolah.sch.id / admin123
- **Kasir**: kasir@sekolah.sch.id / kasir123

### Master Data:
- 1 Tahun Ajaran (2024/2025)
- 1 Institusi (SMK Negeri 1 Jakarta)
- 3 Kategori Keuangan (SPP, Uang Gedung, Operasional)
- 2 Kelas (X TKJ 1, XI TKJ 1)
- 2 Tagihan (SPP Januari, Uang Gedung)

Semua data sudah siap untuk testing aplikasi!
