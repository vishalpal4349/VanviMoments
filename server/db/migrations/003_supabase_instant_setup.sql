-- =========================================================================
-- VANVI MOMENTS — 1-CLICK SUPABASE SETUP & PERMISSIONS FIX
-- Paste this script directly into your Supabase SQL Editor and click RUN
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS
CREATE TABLE IF NOT EXISTS public.profiles (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32),
    role VARCHAR(32) DEFAULT 'user',
    tier VARCHAR(32) DEFAULT 'free',
    coins INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MOMENTS
CREATE TABLE IF NOT EXISTS public.moments (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(64) UNIQUE NOT NULL,
    user_id VARCHAR(64),
    template_id VARCHAR(64) DEFAULT 'common',
    custom_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(32) DEFAULT 'published',
    views INT DEFAULT 0,
    hearts INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    moment_id VARCHAR(64),
    template_name VARCHAR(128) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    coins_used INT DEFAULT 0,
    discount_inr DECIMAL(10, 2) DEFAULT 0.00,
    final_amount_inr DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(16) DEFAULT 'INR',
    gateway VARCHAR(32) DEFAULT 'razorpay',
    gateway_order_id VARCHAR(128),
    status VARCHAR(32) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

-- 4. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64),
    gateway VARCHAR(32) NOT NULL DEFAULT 'razorpay',
    gateway_payment_id VARCHAR(128),
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(16) DEFAULT 'INR',
    status VARCHAR(32) NOT NULL DEFAULT 'captured',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MOMENT ASSETS (Media files attached to moments)
CREATE TABLE IF NOT EXISTS public.moment_assets (
    id VARCHAR(64) PRIMARY KEY,
    moment_id VARCHAR(64),
    template_id VARCHAR(64),
    asset_type VARCHAR(32) DEFAULT 'image',
    storage_path VARCHAR(512),
    public_url TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moment_assets ENABLE ROW LEVEL SECURITY;

-- GRANT TABLE ACCESS TO API ROLES
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.moments TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.payments TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.moment_assets TO anon, authenticated, service_role;

-- DROP OLD POLICIES FIRST TO PREVENT ERROR 42710
DROP POLICY IF EXISTS "Allow all on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow all on moments" ON public.moments;
DROP POLICY IF EXISTS "Allow all on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow all on payments" ON public.payments;
DROP POLICY IF EXISTS "Allow all on moment_assets" ON public.moment_assets;

-- RE-CREATE IDEMPOTENT POLICIES
CREATE POLICY "Allow all on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on moments" ON public.moments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on moment_assets" ON public.moment_assets FOR ALL USING (true) WITH CHECK (true);
