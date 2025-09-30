-- Script untuk mengisi institution_id yang kosong
-- Jalankan di Supabase SQL Editor

-- 1. Lihat data yang ada
SELECT 
    'Classes' as tabel,
    COUNT(*) as total,
    COUNT(institution_id) as with_institution
FROM classes
UNION ALL
SELECT 
    'Institutions' as tabel,
    COUNT(*) as total,
    COUNT(*) as with_institution
FROM institutions;

-- 2. Assign institution_id secara acak ke kelas yang belum ada
UPDATE classes 
SET institution_id = (
    SELECT id 
    FROM institutions 
    WHERE status IN ('Aktif', 'active')
    ORDER BY RANDOM() 
    LIMIT 1
)
WHERE institution_id IS NULL;

-- 3. Verifikasi hasil
SELECT 
    id, 
    name, 
    institution_id,
    (SELECT name FROM institutions WHERE id = classes.institution_id) as institution_name
FROM classes 
LIMIT 5;
