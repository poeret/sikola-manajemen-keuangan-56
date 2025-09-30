-- Script untuk menjalankan migration sekarang
-- Jalankan di Supabase SQL Editor

-- Step 1: Add institution_id column to classes table
ALTER TABLE public.classes 
ADD COLUMN IF NOT EXISTS institution_id UUID;

-- Step 2: Add foreign key constraint (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_classes_institution_id' 
        AND table_name = 'classes'
    ) THEN
        ALTER TABLE public.classes 
        ADD CONSTRAINT fk_classes_institution_id 
        FOREIGN KEY (institution_id) REFERENCES public.institutions(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Step 3: Add index for better performance
CREATE INDEX IF NOT EXISTS idx_classes_institution_id ON public.classes(institution_id);

-- Step 4: Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'classes' 
AND column_name = 'institution_id';

-- Step 5: Check if there are any classes with institution_id
SELECT COUNT(*) as total_classes,
       COUNT(institution_id) as classes_with_institution
FROM classes;
