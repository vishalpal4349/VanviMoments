-- =========================================================================
-- VANVI MOMENTS — PHASE 3 SUPABASE UNLIMITED TEMPLATES DATABASE SCHEMA
-- Free Tier PostgreSQL / Supabase Compatible
-- =========================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS
CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32),
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    role VARCHAR(32) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    tier VARCHAR(32) DEFAULT 'free' CHECK (tier IN ('free', 'member', 'vip')),
    coins INT DEFAULT 100 CHECK (coins >= 0),
    last_spin_time BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 2. TEMPLATES (Unlimited, Independent Architecture, Arbitrary Pricing)
CREATE TABLE IF NOT EXISTS templates (
    template_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(16) DEFAULT 'INR',
    category VARCHAR(64) DEFAULT 'Birthday',
    builder_strategy VARCHAR(64) DEFAULT 'common',
    config JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_templates_active ON templates(is_active);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);

-- 3. TEMPLATE SCHEMAS (Arbitrary Fields, Options, and Specifications)
CREATE TABLE IF NOT EXISTS template_schemas (
    id VARCHAR(64) PRIMARY KEY,
    template_id VARCHAR(64) NOT NULL REFERENCES templates(template_id) ON DELETE CASCADE,
    schema_version VARCHAR(32) DEFAULT '1.0.0',
    fields JSONB NOT NULL DEFAULT '[]'::jsonb,
    customization_options JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_template_schema UNIQUE(template_id, schema_version)
);

CREATE INDEX IF NOT EXISTS idx_template_schemas_tpl ON template_schemas(template_id);

-- 4. MOMENTS (Dynamic JSONB custom_data supporting any template payload)
CREATE TABLE IF NOT EXISTS moments (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(64) UNIQUE NOT NULL,
    user_id VARCHAR(64) REFERENCES profiles(id) ON DELETE SET NULL,
    template_id VARCHAR(64) NOT NULL REFERENCES templates(template_id) ON DELETE RESTRICT,
    custom_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(32) DEFAULT 'published' CHECK (status IN ('draft', 'paid', 'published', 'revoked', 'archived')),
    views INT DEFAULT 0,
    hearts INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moments_slug ON moments(slug);
CREATE INDEX IF NOT EXISTS idx_moments_template ON moments(template_id);
CREATE INDEX IF NOT EXISTS idx_moments_user ON moments(user_id);
CREATE INDEX IF NOT EXISTS idx_moments_custom_data ON moments USING gin (custom_data);

-- 5. MOMENT ASSETS (Media files attached to moments)
CREATE TABLE IF NOT EXISTS moment_assets (
    id VARCHAR(64) PRIMARY KEY,
    moment_id VARCHAR(64) NOT NULL REFERENCES moments(id) ON DELETE CASCADE,
    asset_type VARCHAR(32) NOT NULL CHECK (asset_type IN ('image', 'audio', 'video', 'attachment', 'model_3d')),
    storage_path VARCHAR(512) NOT NULL,
    public_url TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moment_assets_moment ON moment_assets(moment_id);

-- 6. ORDERS
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES profiles(id) ON DELETE SET NULL,
    moment_id VARCHAR(64) REFERENCES moments(id) ON DELETE SET NULL,
    template_id VARCHAR(64) REFERENCES templates(template_id),
    base_price DECIMAL(10, 2) NOT NULL,
    coins_used INT DEFAULT 0,
    discount_inr DECIMAL(10, 2) DEFAULT 0,
    final_amount_inr DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(16) DEFAULT 'INR',
    gateway VARCHAR(32) DEFAULT 'razorpay',
    gateway_order_id VARCHAR(128),
    status VARCHAR(32) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_moment ON orders(moment_id);
CREATE INDEX IF NOT EXISTS idx_orders_gateway ON orders(gateway_order_id);

-- 7. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    gateway VARCHAR(32) NOT NULL,
    gateway_payment_id VARCHAR(128),
    gateway_signature TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(16) DEFAULT 'INR',
    status VARCHAR(32) NOT NULL CHECK (status IN ('authorized', 'captured', 'failed', 'refunded')),
    raw_payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_gw_id ON payments(gateway_payment_id);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_schemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE moment_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Templates & Schemas: Publicly readable when active
CREATE POLICY "Public can view active templates"
    ON templates FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Public can view template schemas"
    ON template_schemas FOR SELECT
    USING (TRUE);

-- Moments: Public can view published moments
CREATE POLICY "Public can view published moments"
    ON moments FOR SELECT
    USING (status = 'published');

-- Moments: Users can create and manage their own moments
CREATE POLICY "Users can create moments"
    ON moments FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Users can update their own moments"
    ON moments FOR UPDATE
    USING (auth.uid()::text = user_id OR user_id IS NULL);

-- Orders: Users can read their own orders
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid()::text = user_id OR user_id IS NULL);

-- Service-role bypasses RLS for backend API operations
