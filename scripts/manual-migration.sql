-- Manual migration script to add institution_id to classes table
-- Run this in Supabase SQL Editor if the migration didn't work

-- Step 1: Add institution_id column to classes table
ALTER TABLE public.classes 
ADD COLUMN IF NOT EXISTS institution_id UUID;

-- Step 2: Add foreign key constraint
ALTER TABLE public.classes 
ADD CONSTRAINT fk_classes_institution_id 
FOREIGN KEY (institution_id) REFERENCES public.institutions(id) ON DELETE CASCADE;

-- Step 3: Add index for better performance
CREATE INDEX IF NOT EXISTS idx_classes_institution_id ON public.classes(institution_id);

-- Step 4: Update existing classes to have a default institution (optional)
-- Uncomment the following lines if you want to set a default institution for existing classes
-- UPDATE public.classes 
-- SET institution_id = (
--   SELECT id FROM public.institutions 
--   WHERE status = 'active' 
--   LIMIT 1
-- )
-- WHERE institution_id IS NULL;

-- Step 5: Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'classes' 
AND column_name = 'institution_id';
