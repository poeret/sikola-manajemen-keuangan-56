-- Script untuk mengecek status database
-- Jalankan di Supabase SQL Editor

-- 1. Cek apakah kolom institution_id ada di tabel classes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'classes' 
AND column_name = 'institution_id';

-- 2. Cek struktur tabel classes
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'classes'
ORDER BY ordinal_position;

-- 3. Cek apakah ada foreign key constraint
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'classes'
    AND kcu.column_name = 'institution_id';

-- 4. Cek data classes yang ada
SELECT 
    id, 
    name, 
    level,
    institution_id,
    created_at
FROM classes 
LIMIT 5;

-- 5. Cek data institutions yang ada
SELECT 
    id, 
    name, 
    status
FROM institutions 
LIMIT 5;
