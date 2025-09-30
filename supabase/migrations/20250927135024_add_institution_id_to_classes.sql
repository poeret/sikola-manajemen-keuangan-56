-- Add institution_id column to classes table
ALTER TABLE public.classes 
ADD COLUMN institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE;

-- Add index for better performance
CREATE INDEX idx_classes_institution_id ON public.classes(institution_id);

-- Update existing classes to have a default institution (if any exists)
-- This is optional - you might want to set this manually
UPDATE public.classes 
SET institution_id = (
  SELECT id FROM public.institutions 
  WHERE status = 'active' 
  LIMIT 1
)
WHERE institution_id IS NULL;
