-- Check migration status
-- Jalankan di Supabase SQL Editor

-- 1. Check if institution_id column exists
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Kolom institution_id ADA'
        ELSE '❌ Kolom institution_id TIDAK ADA'
    END as status_kolom
FROM information_schema.columns 
WHERE table_name = 'classes' 
AND column_name = 'institution_id';

-- 2. Check foreign key constraint
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Foreign key constraint ADA'
        ELSE '❌ Foreign key constraint TIDAK ADA'
    END as status_constraint
FROM information_schema.table_constraints 
WHERE constraint_name = 'fk_classes_institution_id' 
AND table_name = 'classes';

-- 3. Check index
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Index ADA'
        ELSE '❌ Index TIDAK ADA'
    END as status_index
FROM pg_indexes 
WHERE tablename = 'classes' 
AND indexname = 'idx_classes_institution_id';

-- 4. Test query with institution_id
SELECT 
    id, 
    name, 
    institution_id
FROM classes 
LIMIT 3;
