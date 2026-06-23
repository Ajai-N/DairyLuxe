-- ====================================================================
-- DairyLuxe Supabase Database Schema
-- 
-- Instructions: Copy and paste this script directly into the 
-- SQL Editor of your Supabase Dashboard to create all 10 tables.
-- ====================================================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    image TEXT,
    available BOOLEAN DEFAULT TRUE,
    benefits TEXT[] DEFAULT '{}',
    hidden BOOLEAN DEFAULT FALSE
);

-- 2. Partners Table
CREATE TABLE IF NOT EXISTS partners (
    id TEXT PRIMARY KEY, -- e.g., PRT1001
    application_id TEXT,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    address TEXT,
    village TEXT,
    district TEXT,
    experience TEXT,
    why_join TEXT,
    status TEXT DEFAULT 'Active', -- Active / Inactive
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    collection_slot TEXT DEFAULT 'Both' -- Morning / Evening / Both
);

-- 3. Cows Table (Sub-entity of Partners)
CREATE TABLE IF NOT EXISTS cows (
    tag_id TEXT PRIMARY KEY, -- e.g., tag-xxx
    partner_id TEXT REFERENCES partners(id) ON DELETE CASCADE,
    breed TEXT NOT NULL,
    age_years INTEGER NOT NULL,
    daily_yield_liters NUMERIC DEFAULT 0,
    health_status TEXT DEFAULT 'Healthy', -- Healthy / Under Treatment / Excellent
    lactation_stage TEXT DEFAULT 'Lactating' -- Lactating / Dry
);

-- 4. Subscription Customers Table
CREATE TABLE IF NOT EXISTS subscription_customers (
    id TEXT PRIMARY KEY, -- e.g., SUB1001
    application_id TEXT,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    address TEXT,
    quantity NUMERIC NOT NULL,
    delivery_time TEXT DEFAULT 'Both', -- Morning / Evening / Both
    status TEXT DEFAULT 'Active', -- Active / Inactive
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Partner Applications Table
CREATE TABLE IF NOT EXISTS partner_applications (
    id TEXT PRIMARY KEY, -- e.g., APP_PRT_xxxx
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    address TEXT,
    village TEXT,
    district TEXT,
    farming_experience TEXT,
    why_join TEXT,
    status TEXT DEFAULT 'Pending', -- Pending / Approved / Rejected
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    generated_id TEXT,
    temp_password TEXT
);

-- 6. Subscription Applications Table
CREATE TABLE IF NOT EXISTS subscription_applications (
    id TEXT PRIMARY KEY, -- e.g., APP_SUB_xxxx
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    address TEXT,
    quantity NUMERIC NOT NULL,
    delivery_time TEXT DEFAULT 'Both', -- Morning / Evening / Both
    status TEXT DEFAULT 'Pending', -- Pending / Approved / Rejected
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    generated_id TEXT,
    temp_password TEXT
);

-- 7. Subscription Requests Table (For quantity/address changes, pause/resume)
CREATE TABLE IF NOT EXISTS subscription_requests (
    id TEXT PRIMARY KEY, -- e.g., REQxxxx
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    type TEXT NOT NULL, -- Quantity Change / Address Change / Pause / Resume
    details TEXT NOT NULL,
    status TEXT DEFAULT 'Pending', -- Pending / Approved / Rejected
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Bulk Orders Table (B2B Enquiries)
CREATE TABLE IF NOT EXISTS bulk_orders (
    id TEXT PRIMARY KEY, -- e.g., BLKxxxx
    business_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    requirements TEXT NOT NULL,
    quantity TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'Pending', -- Pending / Processing / Delivered / Cancelled
    amount NUMERIC DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Orders Table (General Orders logs)
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY, -- e.g., ORDxxxx
    customer_name TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity NUMERIC NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'Pending', -- Pending / Processing / Delivered / Cancelled
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY, -- e.g., ANNxxxx
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'General', -- Training / Veterinary Camp / Company Update / Opportunity / General
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Workers Table
CREATE TABLE IF NOT EXISTS workers (
    id TEXT PRIMARY KEY, -- e.g., WRK1001
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    status TEXT DEFAULT 'Active', -- Active / Inactive
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Milk Records Table
CREATE TABLE IF NOT EXISTS milk_records (
    id TEXT PRIMARY KEY, -- e.g., RECxxxx
    worker_id TEXT NOT NULL,
    worker_name TEXT NOT NULL,
    target_id TEXT NOT NULL,
    target_name TEXT NOT NULL,
    target_type TEXT NOT NULL, -- partner / customer
    quantity NUMERIC NOT NULL,
    date TEXT NOT NULL, -- YYYY-MM-DD
    slot TEXT NOT NULL, -- Morning / Evening
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create basic indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_cows_partner ON cows(partner_id);
CREATE INDEX IF NOT EXISTS idx_sub_req_customer ON subscription_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_bulk_orders_status ON bulk_orders(status);
CREATE INDEX IF NOT EXISTS idx_milk_records_target ON milk_records(target_id);
CREATE INDEX IF NOT EXISTS idx_milk_records_worker ON milk_records(worker_id);

