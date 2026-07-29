-- SQL Schema for AquaVault Database on Supabase

-- 1. Species
CREATE TABLE IF NOT EXISTS species (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price INT NOT NULL,
    min_threshold INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tanks
CREATE TABLE IF NOT EXISTS tanks (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    capacity INT NOT NULL,
    temp TEXT NOT NULL,
    ph TEXT NOT NULL,
    type TEXT NOT NULL,
    added_date TEXT NOT NULL,
    is_quarantined BOOLEAN DEFAULT FALSE,
    quarantine_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tank Stock (Species + Age Group + Tank count mapping)
CREATE TABLE IF NOT EXISTS tank_stock (
    id SERIAL PRIMARY KEY,
    species_id INT NOT NULL,
    age_group TEXT NOT NULL,
    tank_id TEXT NOT NULL,
    count INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Sales
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    species_id INT NOT NULL,
    species_name TEXT NOT NULL,
    age_group TEXT NOT NULL,
    tank_id TEXT NOT NULL,
    qty INT NOT NULL,
    unit_price INT NOT NULL,
    total INT NOT NULL,
    buyer TEXT NOT NULL,
    pay_mode TEXT NOT NULL,
    pay_status TEXT NOT NULL,
    worker_name TEXT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    date TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Expenses
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    amount INT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    tank_id TEXT,
    worker_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Customers
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    total_orders INT DEFAULT 0,
    total_value INT DEFAULT 0,
    last_order TEXT DEFAULT '—',
    top_species TEXT DEFAULT '—',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Workers
CREATE TABLE IF NOT EXISTS workers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    pin TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Equipment
CREATE TABLE IF NOT EXISTS equipment (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    tank_id TEXT NOT NULL,
    purchase_date TEXT NOT NULL,
    last_service TEXT NOT NULL,
    next_service TEXT NOT NULL,
    cost INT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Water Log
CREATE TABLE IF NOT EXISTS water_log (
    id SERIAL PRIMARY KEY,
    tank_id TEXT NOT NULL,
    date TEXT NOT NULL,
    ph NUMERIC NOT NULL,
    temp NUMERIC NOT NULL,
    ammonia NUMERIC NOT NULL,
    logged_by TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Activity Log
CREATE TABLE IF NOT EXISTS activity (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    worker_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
