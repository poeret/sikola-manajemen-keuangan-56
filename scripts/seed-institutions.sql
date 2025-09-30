-- Script to seed institutions data
-- Run this in Supabase SQL Editor if no institutions exist

-- Insert sample institutions data
INSERT INTO institutions (name, address, principal, phone, email, status) VALUES
('SMA Negeri 1 Jakarta', 'Jl. Merdeka No. 1, Jakarta Pusat', 'Dr. Budi Santoso, M.Pd', '021-1234567', 'sman1@jakarta.sch.id', 'active'),
('SMA Negeri 2 Jakarta', 'Jl. Sudirman No. 2, Jakarta Selatan', 'Dra. Siti Aminah, M.Pd', '021-2345678', 'sman2@jakarta.sch.id', 'active'),
('SMA Swasta ABC', 'Jl. Thamrin No. 3, Jakarta Pusat', 'Prof. Ahmad Wijaya, Ph.D', '021-3456789', 'info@smabc.sch.id', 'active'),
('SMA Negeri 3 Jakarta', 'Jl. Gatot Subroto No. 4, Jakarta Selatan', 'Dr. Maria Sari, M.Pd', '021-4567890', 'sman3@jakarta.sch.id', 'active'),
('SMA Swasta XYZ', 'Jl. Kuningan No. 5, Jakarta Selatan', 'Drs. John Doe, M.Pd', '021-5678901', 'info@smaxyz.sch.id', 'active')
ON CONFLICT (name) DO NOTHING;

-- Verify the data
SELECT id, name, status FROM institutions ORDER BY name;
