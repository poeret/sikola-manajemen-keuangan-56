-- Script untuk reset dan seed data dummy
-- HATI-HATI: Script ini akan menghapus data yang ada!

-- 1. Hapus data yang ada (dalam urutan yang benar untuk foreign key)
DELETE FROM public.bills WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002'
);

DELETE FROM public.classes WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002'
);

DELETE FROM public.financial_categories WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003'
);

DELETE FROM public.institutions WHERE id = '00000000-0000-0000-0000-000000000001';

DELETE FROM public.academic_years WHERE id = '00000000-0000-0000-0000-000000000001';

DELETE FROM public.profiles WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002'
);

DELETE FROM auth.users WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002'
);

-- 2. Insert data baru
-- Insert dummy users ke auth.users (Supabase Auth)
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
-- Super Admin
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@sekolah.sch.id',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
),
-- Kasir
(
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'kasir@sekolah.sch.id',
  crypt('kasir123', gen_salt('bf')),
  NOW(),
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Insert profiles untuk users
INSERT INTO public.profiles (
  id,
  user_id,
  email,
  name,
  role,
  phone,
  address,
  is_active,
  created_at,
  updated_at
) VALUES 
-- Super Admin Profile
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'admin@sekolah.sch.id',
  'Administrator Sekolah',
  'super_admin',
  '081234567890',
  'Jl. Pendidikan No. 123, Jakarta',
  true,
  NOW(),
  NOW()
),
-- Kasir Profile
(
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000002',
  'kasir@sekolah.sch.id',
  'Kasir Sekolah',
  'cashier',
  '081234567891',
  'Jl. Pendidikan No. 123, Jakarta',
  true,
  NOW(),
  NOW()
);

-- Insert academic year dummy data
INSERT INTO public.academic_years (
  id,
  code,
  description,
  start_date,
  end_date,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '2024-2025',
  'Tahun Ajaran 2024/2025',
  '2024-07-01',
  '2025-06-30',
  true,
  NOW(),
  NOW()
);

-- Insert institution dummy data
INSERT INTO public.institutions (
  id,
  name,
  address,
  phone,
  email,
  principal,
  status,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SMK Negeri 1 Jakarta',
  'Jl. Pendidikan No. 123, Jakarta Selatan',
  '021-12345678',
  'info@smkn1jakarta.sch.id',
  'Dr. Ahmad Wijaya, M.Pd',
  'active',
  NOW(),
  NOW()
);

-- Insert financial categories dummy data
INSERT INTO public.financial_categories (
  id,
  name,
  description,
  type,
  status,
  created_at,
  updated_at
) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  'SPP Bulanan',
  'Sumbangan Pembinaan Pendidikan Bulanan',
  'income',
  'active',
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0000-000000000002',
  'Uang Gedung',
  'Biaya Penggunaan Gedung',
  'income',
  'active',
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0000-000000000003',
  'Operasional',
  'Biaya Operasional Sekolah',
  'expense',
  'active',
  NOW(),
  NOW()
);

-- Insert classes dummy data
INSERT INTO public.classes (
  id,
  academic_year_id,
  name,
  level,
  capacity,
  current_students,
  homeroom_teacher,
  created_at,
  updated_at
) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'X TKJ 1',
  10,
  30,
  25,
  'Budi Santoso, S.Kom',
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'XI TKJ 1',
  11,
  30,
  28,
  'Siti Aminah, S.Kom',
  NOW(),
  NOW()
);

-- Insert bills dummy data
INSERT INTO public.bills (
  id,
  academic_year_id,
  name,
  code,
  category,
  amount,
  due_date,
  status,
  created_at,
  updated_at
) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'SPP Bulan Januari 2025',
  'SPP-2025-01',
  'SPP',
  500000,
  '2025-01-31',
  'active',
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'Uang Gedung',
  'UG-2025',
  'Uang Gedung',
  2000000,
  '2025-02-28',
  'active',
  NOW(),
  NOW()
);

-- Verifikasi data
SELECT 'Users created:' as info, COUNT(*) as count FROM auth.users WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002'
);

SELECT 'Profiles created:' as info, COUNT(*) as count FROM public.profiles WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002'
);

SELECT 'Academic years created:' as info, COUNT(*) as count FROM public.academic_years;

SELECT 'Institutions created:' as info, COUNT(*) as count FROM public.institutions;

SELECT 'Financial categories created:' as info, COUNT(*) as count FROM public.financial_categories;

SELECT 'Classes created:' as info, COUNT(*) as count FROM public.classes;

SELECT 'Bills created:' as info, COUNT(*) as count FROM public.bills;
