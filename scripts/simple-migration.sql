-- Simple migration script - run step by step
-- Jalankan di Supabase SQL Editor satu per satu

-- Step 1: Add institution_id column
ALTER TABLE public.classes 
ADD COLUMN institution_id UUID;

-- Step 2: Add foreign key constraint
ALTER TABLE public.classes 
ADD CONSTRAINT fk_classes_institution_id 
FOREIGN KEY (institution_id) REFERENCES public.institutions(id) ON DELETE SET NULL;

-- Step 3: Add index
CREATE INDEX idx_classes_institution_id ON public.classes(institution_id);

-- Step 4: Verify
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'classes' 
AND column_name = 'institution_id';
