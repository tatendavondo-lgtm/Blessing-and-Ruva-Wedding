-- ==============================================================================
-- Blessing & Ruvarashe Wedding — Supabase PostgreSQL Schema
-- Database setup for Aura Vows / VowFlow
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Create Guests Table
CREATE TABLE IF NOT EXISTS public.guests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  invite_code TEXT NOT NULL UNIQUE,
  ticket_code TEXT NOT NULL UNIQUE, -- 4-digit pass code for rapid gate entry
  rsvp_status TEXT NOT NULL DEFAULT 'pending' CHECK (rsvp_status IN ('accepted', 'declined', 'pending')),
  party_size INT NOT NULL DEFAULT 1,
  confirmed_headcount INT NOT NULL DEFAULT 0,
  plus_one_name TEXT,
  dietary_requirements TEXT DEFAULT 'None',
  song_request TEXT,
  notes TEXT,
  is_vip BOOLEAN NOT NULL DEFAULT FALSE,
  check_in_status TEXT NOT NULL DEFAULT 'not_checked_in' CHECK (check_in_status IN ('checked_in', 'not_checked_in')),
  check_in_time TIMESTAMPTZ,
  checked_in_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast lookup indexes for gate terminals and guest links
CREATE INDEX IF NOT EXISTS idx_guests_ticket_code ON public.guests(ticket_code);
CREATE INDEX IF NOT EXISTS idx_guests_invite_code ON public.guests(invite_code);
CREATE INDEX IF NOT EXISTS idx_guests_check_in_status ON public.guests(check_in_status);
CREATE INDEX IF NOT EXISTS idx_guests_rsvp_status ON public.guests(rsvp_status);

-- 2. Create Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  type TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  details TEXT NOT NULL,
  severity TEXT DEFAULT 'info'
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON public.activity_logs(timestamp DESC);

-- 3. Create Wedding Configuration Table
CREATE TABLE IF NOT EXISTS public.wedding_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  couple_names TEXT NOT NULL DEFAULT 'Blessing Matiza & Ruvarashe Chakawora',
  wedding_date TIMESTAMPTZ NOT NULL DEFAULT '2026-12-22T13:30:00Z',
  venue_name TEXT NOT NULL DEFAULT 'Swan Creek Gardens',
  venue_address TEXT NOT NULL DEFAULT '899 Gletwyn Road, Shawasha Hills, Harare',
  venue_capacity INT NOT NULL DEFAULT 300,
  gate_pin TEXT NOT NULL DEFAULT '4389',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_config ENABLE ROW LEVEL SECURITY;

-- 5. Row Level Security Policies
-- Guests table
CREATE POLICY "Allow read guests" ON public.guests FOR SELECT USING (true);
CREATE POLICY "Allow insert guests" ON public.guests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update guests" ON public.guests FOR UPDATE USING (true);

-- Activity logs table
CREATE POLICY "Allow read activity logs" ON public.activity_logs FOR SELECT USING (true);
CREATE POLICY "Allow insert activity logs" ON public.activity_logs FOR INSERT WITH CHECK (true);

-- Wedding configuration table
CREATE POLICY "Allow read wedding config" ON public.wedding_config FOR SELECT USING (true);
CREATE POLICY "Allow update wedding config" ON public.wedding_config FOR UPDATE USING (true);

-- 6. Enable Realtime Publications for instant multi-device gate synchronization
ALTER PUBLICATION supabase_realtime ADD TABLE public.guests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;

-- 7. Seed Initial Wedding Configuration
INSERT INTO public.wedding_config (id, couple_names, wedding_date, venue_name, venue_address, venue_capacity, gate_pin)
VALUES (
  'default',
  'Blessing Matiza & Ruvarashe Chakawora',
  '2026-12-22T13:30:00Z',
  'Swan Creek Gardens',
  '899 Gletwyn Road, Shawasha Hills, Harare',
  300,
  '4389'
)
ON CONFLICT (id) DO UPDATE SET
  couple_names = EXCLUDED.couple_names,
  wedding_date = EXCLUDED.wedding_date,
  venue_name = EXCLUDED.venue_name,
  venue_address = EXCLUDED.venue_address,
  venue_capacity = EXCLUDED.venue_capacity,
  gate_pin = EXCLUDED.gate_pin;

-- 8. Seed Initial VIP Family and Bridal Party Guests with 4-Digit Pass Codes
INSERT INTO public.guests (
  id, name, email, phone, invite_code, ticket_code, rsvp_status,
  party_size, confirmed_headcount, plus_one_name, dietary_requirements, is_vip, check_in_status, notes
) VALUES
  (
    'g-001', 'Mr & Mrs Matiza', 'parents.matiza@family.co.zw', '+263 77 111 2233',
    'parents-matiza', '4301', 'accepted', 2, 2, 'Mrs. Matiza', 'Traditional / No Pork', true, 'not_checked_in', 'Parents of the Groom'
  ),
  (
    'g-002', 'Mr & Mrs Chakawora', 'parents.chakawora@family.co.zw', '+263 77 444 5566',
    'parents-chakawora', '4302', 'accepted', 2, 2, 'Mrs. Chakawora', 'Standard', true, 'not_checked_in', 'Parents of the Bride'
  ),
  (
    'g-003', 'Farai Matiza', 'farai.matiza@matizagroup.co', '+263 77 890 1234',
    'farai-matiza', '8812', 'accepted', 2, 2, 'Rudo Sibanda', 'None', true, 'checked_in', 'Best Man'
  ),
  (
    'g-004', 'Chiedza Chakawora', 'chiedza.c@designhouse.co.zw', '+263 71 234 5678',
    'chiedza-chakawora', '7721', 'accepted', 2, 2, 'Tawana Nyathi', 'Vegetarian', true, 'not_checked_in', 'Maid of Honor'
  ),
  (
    'g-005', 'Tinashe Moyo', 'tinashe.moyo@investcorp.zw', NULL,
    'tinashe-moyo', '5534', 'accepted', 2, 2, 'Shamiso Moyo', 'None', false, 'not_checked_in', NULL
  ),
  (
    'g-006', 'Dr. Nyasha Ndlovu', 'dr.ndlovu@harareclinic.org', NULL,
    'nyasha-ndlovu', '9014', 'pending', 2, 0, NULL, 'Pending', false, 'not_checked_in', NULL
  ),
  (
    'g-007', 'Kudzai & Vimbai Sibanda', 'kudzai.sibanda@techhub.co.zw', NULL,
    'kudzai-sibanda', '6120', 'accepted', 2, 2, 'Vimbai Sibanda', 'Gluten-Free', false, 'not_checked_in', NULL
  ),
  (
    'g-008', 'Tariro Mutasa', 'tariro.mutasa@africabridge.com', NULL,
    'tariro-mutasa', '3391', 'declined', 2, 0, NULL, 'N/A', false, 'not_checked_in', 'Warmest congratulations from London!'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  ticket_code = EXCLUDED.ticket_code,
  invite_code = EXCLUDED.invite_code,
  rsvp_status = EXCLUDED.rsvp_status;
