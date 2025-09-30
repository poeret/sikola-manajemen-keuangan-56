-- Script to get institution reference data for Excel template
-- Run this in Supabase SQL Editor to get institution IDs and names

SELECT 
  id as "ID_Lembaga",
  name as "Nama_Lembaga",
  address as "Alamat",
  principal as "Kepala_Lembaga",
  status as "Status"
FROM institutions 
WHERE status IN ('Aktif', 'active')
ORDER BY name;

-- Example output format for Excel template:
-- ID_Lembaga | Nama_Lembaga | Alamat | Kepala_Lembaga | Status
-- 8201056a-594d-46bb-bddd-ca9f99bdb04d | MA Negeri 1 Jakarta | Jl. Merdeka No. 1 | Dr. Budi Santoso | Aktif
-- 00000000-0000-0000-0000-000000000001 | MTs Maju Makmur | Jl. Sudirman No. 2 | Dra. Siti Aminah | Aktif
