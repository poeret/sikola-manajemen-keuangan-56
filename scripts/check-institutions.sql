-- Script to check institutions data
-- Run this in Supabase SQL Editor

-- Check if there are any institutions
SELECT COUNT(*) as total_institutions FROM institutions;

-- Check institutions with status active
SELECT COUNT(*) as active_institutions FROM institutions WHERE status = 'active';

-- Show all institutions
SELECT id, name, status, created_at FROM institutions ORDER BY name;

-- If no institutions exist, insert some sample data
INSERT INTO institutions (name, address, principal, status) VALUES
('SMA Negeri 1 Jakarta', 'Jl. Merdeka No. 1, Jakarta', 'Dr. Budi Santoso, M.Pd', 'active'),
('SMA Negeri 2 Jakarta', 'Jl. Sudirman No. 2, Jakarta', 'Dra. Siti Aminah, M.Pd', 'active'),
('SMA Swasta ABC', 'Jl. Thamrin No. 3, Jakarta', 'Prof. Ahmad Wijaya, Ph.D', 'active')
ON CONFLICT DO NOTHING;
