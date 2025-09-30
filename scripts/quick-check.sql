-- Quick check untuk status database
-- Jalankan di Supabase SQL Editor

-- Cek apakah kolom institution_id ada
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN 'Kolom institution_id ADA'
        ELSE 'Kolom institution_id TIDAK ADA'
    END as status_kolom
FROM information_schema.columns 
WHERE table_name = 'classes' 
AND column_name = 'institution_id';

-- Cek jumlah classes dan institutions
SELECT 
    'Classes' as tabel,
    COUNT(*) as jumlah
FROM classes
UNION ALL
SELECT 
    'Institutions' as tabel,
    COUNT(*) as jumlah
FROM institutions;
