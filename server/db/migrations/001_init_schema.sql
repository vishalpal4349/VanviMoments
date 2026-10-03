-- =========================================================================
-- VANVI MOMENTS — PRODUCTION DATABASE DDL (PostgreSQL / Supabase Compatible)
-- Version: 1.0.0
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
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
    created_at BIGINT NOT NULL,
    updated_at BIGINT
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. MEMBERSHIPS TABLE
CREATE TABLE IF NOT EXISTS memberships (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id VARCHAR(64) NOT NULL CHECK (plan_id IN ('monthly', 'annual', 'lifetime')),
    status VARCHAR(32) DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'expired')),
    start_date BIGINT NOT NULL,
    end_date BIGINT NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    gateway_sub_id VARCHAR(128),
    created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);

-- 3. MOMENTS TABLE
CREATE TABLE IF NOT EXISTS moments (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    slug VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    recipient VARCHAR(128) NOT NULL,
    sender VARCHAR(128) NOT NULL,
    occasion VARCHAR(64) NOT NULL,
    message TEXT NOT NULL,
    photos JSONB DEFAULT '[]'::jsonb,
    music_track VARCHAR(128) DEFAULT 'acoustic-piano',
    lock_mode VARCHAR(32) DEFAULT 'envelope' CHECK (lock_mode IN ('envelope', 'pin')),
    pin_hash VARCHAR(128),
    pin_hint VARCHAR(255),
    theme VARCHAR(64) DEFAULT 'Velvet Rose',
    status VARCHAR(32) DEFAULT 'draft' CHECK (status IN ('draft', 'paid', 'published', 'revoked')),
    views INT DEFAULT 0,
    hearts INT DEFAULT 0,
    created_at BIGINT NOT NULL,
    updated_at BIGINT
);

CREATE INDEX IF NOT EXISTS idx_moments_slug ON moments(slug);
CREATE INDEX IF NOT EXISTS idx_moments_user ON moments(user_id);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    moment_id VARCHAR(64) REFERENCES moments(id) ON DELETE SET NULL,
    template_name VARCHAR(128) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    coins_used INT DEFAULT 0,
    discount_inr DECIMAL(10, 2) DEFAULT 0,
    final_amount_inr DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(16) DEFAULT 'INR',
    gateway VARCHAR(32) DEFAULT 'razorpay',
    gateway_order_id VARCHAR(128),
    status VARCHAR(32) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    created_at BIGINT NOT NULL,
    paid_at BIGINT
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_gateway ON orders(gateway_order_id);

-- 5. COIN LEDGER TABLE (Append-Only Transaction Log)
CREATE TABLE IF NOT EXISTS coin_ledger (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(32) NOT NULL CHECK (type IN ('credit', 'debit', 'refund')),
    amount INT NOT NULL CHECK (amount > 0),
    balance_after INT NOT NULL CHECK (balance_after >= 0),
    reason VARCHAR(255) NOT NULL,
    ref_id VARCHAR(128),
    created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_coin_ledger_user ON coin_ledger(user_id);

-- 6. TEMPLATES CATALOG TABLE
CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    occasion VARCHAR(64) NOT NULL,
    category VARCHAR(64) NOT NULL,
    base_price DECIMAL(10, 2) DEFAULT 199.00,
    is_premium BOOLEAN DEFAULT FALSE,
    preview_media JSONB DEFAULT '{}'::jsonb,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    active BOOLEAN DEFAULT TRUE,
    created_at BIGINT NOT NULL
);

-- 7. ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS analytics_events (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    event_name VARCHAR(128) NOT NULL,
    properties JSONB DEFAULT '{}'::jsonb,
    ip_hash VARCHAR(128),
    user_agent TEXT,
    created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_time ON analytics_events(created_at);

-- 8. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    actor_user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(128) NOT NULL,
    target_entity VARCHAR(64) NOT NULL,
    target_id VARCHAR(64) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at BIGINT NOT NULL
);

