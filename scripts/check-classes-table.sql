-- Cek struktur tabel classes
-- Jalankan di Supabase SQL Editor

-- 1. Cek apakah kolom institution_id ada di tabel classes
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN 'Kolom institution_id ADA di tabel classes'
        ELSE 'Kolom institution_id TIDAK ADA di tabel classes'
    END as status_kolom
FROM information_schema.columns 
WHERE table_name = 'classes' 
AND column_name = 'institution_id';

-- 2. Lihat semua kolom di tabel classes
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'classes'
ORDER BY ordinal_position;

-- 3. Cek data classes yang ada (dengan institution_id jika ada)
SELECT 
    id, 
    name, 
    level,
    institution_id,
    created_at
FROM classes 
LIMIT 5;
