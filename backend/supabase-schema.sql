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

-- Seed Data for workers
INSERT INTO workers (id, name, role, pin) VALUES
(1, 'Rajan Patil', 'Senior Handler', '0001'),
(2, 'Suresh Kamble', 'Tank Operator', '0002'),
(3, 'Amol Shinde', 'Sales Assistant', '0003'),
(4, 'Deepak More', 'Maintenance', '0004');
SELECT setval('workers_id_seq', (SELECT MAX(id) FROM workers));

-- Seed Data for species
INSERT INTO species (id, name, price, min_threshold) VALUES
(1, 'Guppy (Fancy)', 80, 50),
(2, 'Arowana (Silver)', 3500, 5),
(3, 'Discus (Blue)', 900, 15),
(4, 'Neon Tetra', 60, 30),
(5, 'Betta (Red)', 250, 8),
(6, 'Koi (Kohaku)', 2000, 5),
(7, 'Oscar', 450, 5),
(8, 'Angel Fish', 180, 10),
(9, 'Goldfish (Fancy)', 150, 15),
(10, 'Clownfish', 600, 8);
SELECT setval('species_id_seq', (SELECT MAX(id) FROM species));

-- Seed Data for tanks
INSERT INTO tanks (id, display_name, capacity, temp, ph, type, added_date, is_quarantined, quarantine_reason) VALUES
('A', 'Tank A', 600, '26°C', '7.2', 'Freshwater', '2024-01-10', FALSE, NULL),
('B', 'Tank B', 120, '27°C', '6.8', 'Freshwater', '2024-01-10', FALSE, NULL),
('C', 'Tank C', 200, '28°C', '6.5', 'Freshwater', '2024-02-15', TRUE, 'pH imbalance — monitoring'),
('D', 'Tank D', 60, '26°C', '7.0', 'Freshwater', '2024-03-20', FALSE, NULL),
('E', 'Tank E', 300, '22°C', '7.4', 'Freshwater', '2024-05-01', FALSE, NULL),
('F', 'Tank F', 100, '25°C', '8.2', 'Marine', '2025-01-08', FALSE, NULL);

-- Seed Data for tank_stock
INSERT INTO tank_stock (species_id, age_group, tank_id, count) VALUES
(1, 'adult', 'A', 80),
(1, 'adult', 'B', 40),
(1, 'semi-adult', 'A', 70),
(1, 'semi-adult', 'C', 50),
(1, 'newborn', 'C', 60),
(1, 'newborn', 'D', 40),
(2, 'adult', 'B', 12),
(3, 'adult', 'C', 22),
(3, 'semi-adult', 'D', 13),
(4, 'adult', 'A', 100),
(4, 'semi-adult', 'A', 80),
(5, 'adult', 'D', 28),
(6, 'adult', 'E', 10),
(6, 'semi-adult', 'E', 8),
(7, 'adult', 'B', 9),
(8, 'adult', 'C', 25),
(8, 'semi-adult', 'C', 17),
(9, 'adult', 'A', 40),
(9, 'newborn', 'A', 25),
(10, 'adult', 'F', 22);

-- Seed Data for customers
INSERT INTO customers (id, name, contact, total_orders, total_value, last_order, top_species) VALUES
(1, 'PetZone Pune', '9876543210', 8, 18400, '2026-07-25', 'Guppy (Fancy)'),
(2, 'AquaWorld Mumbai', '9823456789', 5, 42000, '2026-07-24', 'Arowana (Silver)'),
(3, 'FishMart Nashik', '9845612378', 3, 9800, '2026-07-23', 'Neon Tetra'),
(4, 'Royal Aquatics', '9812345670', 6, 28500, '2026-07-22', 'Koi (Kohaku)'),
(5, 'HomeAqua Kolhapur', '9867453210', 2, 3800, '2026-07-20', 'Betta (Red)');
SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));

-- Seed Data for equipment
INSERT INTO equipment (id, name, type, tank_id, purchase_date, last_service, next_service, cost, status) VALUES
(1, 'Tank A - Main Filter', 'Filter', 'A', '2024-03-10', '2026-04-10', '2026-07-10', 4500, 'overdue'),
(2, 'Tank B - Water Pump', 'Pump', 'B', '2025-01-15', '2026-06-15', '2026-09-15', 3200, 'ok'),
(3, 'Tank C - Heater', 'Heater', 'C', '2024-08-20', '2026-05-20', '2026-08-20', 1800, 'due-soon'),
(4, 'Tank D - Aerator', 'Aerator', 'D', '2025-06-01', '2026-06-01', '2026-09-01', 900, 'ok'),
(5, 'Tank E - Filter', 'Filter', 'E', '2024-11-12', '2026-04-12', '2026-07-12', 3800, 'overdue'),
(6, 'Tank F - Marine Pump', 'Pump', 'F', '2025-03-05', '2026-05-05', '2026-08-05', 5500, 'due-soon');
SELECT setval('equipment_id_seq', (SELECT MAX(id) FROM equipment));

-- Seed Data for water_log
INSERT INTO water_log (id, tank_id, date, ph, temp, ammonia, logged_by, status) VALUES
(1, 'A', '2026-07-27', 7.1, 26.2, 0.0, 'Suresh Kamble', 'normal'),
(2, 'B', '2026-07-27', 6.9, 27.0, 0.1, 'Suresh Kamble', 'normal'),
(3, 'C', '2026-07-27', 8.4, 28.5, 0.3, 'Rajan Patil', 'warning'),
(4, 'D', '2026-07-27', 7.0, 26.0, 0.0, 'Rajan Patil', 'normal'),
(5, 'E', '2026-07-27', 7.3, 22.1, 0.0, 'Deepak More', 'normal'),
(6, 'F', '2026-07-27', 8.1, 25.0, 0.2, 'Deepak More', 'normal');
SELECT setval('water_log_id_seq', (SELECT MAX(id) FROM water_log));

-- Seed Data for sales
INSERT INTO sales (id, species_id, species_name, age_group, tank_id, qty, unit_price, total, buyer, pay_mode, pay_status, worker_name, approved, date, note) VALUES
(1, 1, 'Guppy (Fancy)', 'adult', 'A', 30, 80, 2400, 'PetZone Pune', 'UPI', 'paid', 'Amol Shinde', TRUE, '2026-07-25', 'Bulk retail order'),
(2, 2, 'Arowana (Silver)', 'adult', 'B', 2, 3500, 7000, 'AquaWorld Mumbai', 'Cash', 'paid', 'Rajan Patil', TRUE, '2026-07-24', 'VIP customer direct purchase'),
(3, 4, 'Neon Tetra', 'semi-adult', 'A', 50, 60, 3000, 'FishMart Nashik', 'UPI', 'pending', 'Amol Shinde', TRUE, '2026-07-23', 'Awaiting bank confirmation'),
(4, 6, 'Koi (Kohaku)', 'adult', 'E', 3, 2000, 6000, 'Royal Aquatics', 'Cash', 'paid', 'Rajan Patil', TRUE, '2026-07-22', 'Special breeding stock selection'),
(5, 8, 'Angel Fish', 'adult', 'C', 10, 180, 1800, 'PetZone Pune', 'UPI', 'paid', 'Amol Shinde', FALSE, '2026-07-21', 'Pending manager check'),
(6, 5, 'Betta (Red)', 'adult', 'D', 5, 250, 1250, 'HomeAqua Kolhapur', 'Cash', 'paid', 'Suresh Kamble', TRUE, '2026-07-20', 'Walk-in customer purchase');
SELECT setval('sales_id_seq', (SELECT MAX(id) FROM sales));

-- Seed Data for expenses
INSERT INTO expenses (id, category, amount, description, date, tank_id, worker_name) VALUES
(1, 'Fish Food', 3200, 'Hikari pellets - 5kg', '2026-07-20', NULL, 'Rajan Patil'),
(2, 'Equipment Repair', 8500, 'Tank B pump replacement', '2026-07-18', 'B', 'Deepak More'),
(3, 'Medications', 1800, 'Melafix antibiotic treatment', '2026-07-15', 'C', 'Rajan Patil'),
(4, 'Utilities', 4200, 'Electricity bill - July', '2026-07-10', NULL, NULL),
(5, 'Filter/Equipment', 2600, 'Carbon filter replacements x4', '2026-07-08', NULL, 'Deepak More'),
(6, 'Fish Food', 1400, 'Live bloodworms - weekly', '2026-07-25', NULL, 'Suresh Kamble'),
(7, 'Tank Repair', 12000, 'Tank E glass crack repair', '2026-07-22', 'E', 'Deepak More'),
(8, 'Labour', 24000, 'Worker wages - July', '2026-07-01', NULL, NULL);
SELECT setval('expenses_id_seq', (SELECT MAX(id) FROM expenses));

-- Seed Data for activity
INSERT INTO activity (id, type, description, worker_name) VALUES
(1, 'birth', '{"species":"Guppy (Fancy)","ageGroup":"newborn","count":12,"tank":"A","note":"Natural breeding cycle"}', 'Rajan Patil'),
(2, 'export', '{"species":"Arowana (Silver)","ageGroup":"adult","count":2,"tank":"B","note":"AquaWorld Mumbai order"}', 'Amol Shinde'),
(3, 'death', '{"species":"Discus (Blue)","ageGroup":"adult","count":1,"tank":"C","note":"pH imbalance detected"}', 'Suresh Kamble'),
(4, 'export', '{"species":"Neon Tetra","ageGroup":"semi-adult","count":30,"tank":"A","note":"Bulk retail order"}', 'Amol Shinde'),
(5, 'birth', '{"species":"Koi (Kohaku)","ageGroup":"newborn","count":4,"tank":"E","note":"Spring spawn"}', 'Suresh Kamble'),
(6, 'export', '{"species":"Betta (Red)","ageGroup":"adult","count":5,"tank":"D","note":"PetZone Pune"}', 'Amol Shinde');
SELECT setval('activity_id_seq', (SELECT MAX(id) FROM activity));

-- Disable Row Level Security (RLS) on all tables for the Node backend
ALTER TABLE species DISABLE ROW LEVEL SECURITY;
ALTER TABLE tanks DISABLE ROW LEVEL SECURITY;
ALTER TABLE tank_stock DISABLE ROW LEVEL SECURITY;
ALTER TABLE sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE workers DISABLE ROW LEVEL SECURITY;
ALTER TABLE equipment DISABLE ROW LEVEL SECURITY;
ALTER TABLE water_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity DISABLE ROW LEVEL SECURITY;

