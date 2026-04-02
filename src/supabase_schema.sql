
-- Run this SQL in your Supabase SQL Editor to create the necessary tables

CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  phone TEXT,
  date_of_birth TEXT,
  password TEXT,
  ssn TEXT,
  address TEXT,
  account_type TEXT,
  account_number TEXT,
  routing_number TEXT,
  balance NUMERIC DEFAULT 0,
  pin TEXT,
  profile_picture_url TEXT,
  verification_status TEXT DEFAULT 'Pending Review',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type TEXT,
  amount NUMERIC,
  description TEXT,
  recipient_details JSONB,
  status TEXT DEFAULT 'Completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type TEXT,
  url TEXT,
  status TEXT DEFAULT 'Pending Review',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE next_of_kin (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  full_name TEXT,
  phone TEXT,
  email TEXT,
  date_of_birth TEXT,
  address TEXT,
  ssn TEXT,
  relationship TEXT,
  verification_status TEXT DEFAULT 'Pending Review',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE nok_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nok_id UUID REFERENCES next_of_kin(id),
  type TEXT,
  url TEXT,
  status TEXT DEFAULT 'Pending Review',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE crypto_deposits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  crypto_type TEXT,
  amount_usd NUMERIC,
  receipt_url TEXT,
  status TEXT DEFAULT 'Pending Review',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE gift_card_deposits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  card_type TEXT,
  amount NUMERIC,
  card_code TEXT,
  details TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'Pending Review',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cashapp_deposits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount NUMERIC,
  proof_url TEXT,
  status TEXT DEFAULT 'Pending Review',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE loan_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  loan_type TEXT,
  amount NUMERIC,
  duration TEXT,
  status TEXT DEFAULT 'Pending Review',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Realtime for notifications
alter publication supabase_realtime add table notifications;

-- Note: You will need to create a storage bucket named 'uploads' and make it public manually in the Supabase dashboard.
