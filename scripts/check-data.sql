-- Script untuk mengecek data di Supabase
-- Jalankan script ini di SQL Editor di Supabase Dashboard

-- Cek apakah ada users di auth.users
SELECT 
  id, 
  email, 
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email IN ('admin@sekolah.sch.id', 'kasir@sekolah.sch.id')
ORDER BY created_at DESC;

-- Cek apakah ada profiles
SELECT 
  id,
  user_id,
  email,
  name,
  role,
  is_active,
  created_at
FROM public.profiles 
WHERE email IN ('admin@sekolah.sch.id', 'kasir@sekolah.sch.id')
ORDER BY created_at DESC;

-- Cek apakah ada data di tabel lain
SELECT 'academic_years' as table_name, COUNT(*) as count FROM public.academic_years
UNION ALL
SELECT 'institutions' as table_name, COUNT(*) as count FROM public.institutions
UNION ALL
SELECT 'financial_categories' as table_name, COUNT(*) as count FROM public.financial_categories
UNION ALL
SELECT 'classes' as table_name, COUNT(*) as count FROM public.classes
UNION ALL
SELECT 'bills' as table_name, COUNT(*) as count FROM public.bills;
