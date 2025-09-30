-- Update unique constraint for student_bills to allow monthly instances per bill
-- Drops any UNIQUE constraint on (student_id, bill_id) and adds (student_id, bill_id, due_date)

DO $$
DECLARE
  cons RECORD;
BEGIN
  FOR cons IN
    SELECT conname
    FROM pg_constraint c
    JOIN pg_class r ON r.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = c.connamespace
    WHERE n.nspname = 'public'
      AND r.relname = 'student_bills'
      AND c.contype = 'u'
      AND pg_get_constraintdef(c.oid) ILIKE 'UNIQUE (student_id, bill_id)%'
  LOOP
    EXECUTE format('ALTER TABLE public.student_bills DROP CONSTRAINT %I;', cons.conname);
  END LOOP;
END $$;

-- Create the new unique constraint including due_date
ALTER TABLE public.student_bills
ADD CONSTRAINT student_bills_student_id_bill_id_due_date_key
UNIQUE (student_id, bill_id, due_date);


