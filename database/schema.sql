-- ==========================
-- USERS
-- ==========================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN','SALES','WAREHOUSE','ACCOUNTS')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- CUSTOMERS
-- ==========================
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    email VARCHAR(150),
    business_name VARCHAR(150),
    gst_number VARCHAR(20),
    customer_type VARCHAR(20) CHECK (customer_type IN ('Retail','Wholesale','Distributor')),
    address TEXT,
    status VARCHAR(20) DEFAULT 'Lead',
    follow_up_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- PRODUCTS
-- ==========================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(100),
    unit_price DECIMAL(10,2) NOT NULL,
    current_stock INT DEFAULT 0,
    minimum_stock INT DEFAULT 5,
    warehouse_location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- INVENTORY LOGS
-- ==========================
CREATE TABLE inventory_logs (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    quantity_changed INT NOT NULL,
    movement_type VARCHAR(10) CHECK (movement_type IN ('IN','OUT')),
    reason TEXT,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- CHALLANS
-- ==========================
CREATE TABLE challans (
    id SERIAL PRIMARY KEY,
    challan_number VARCHAR(30) UNIQUE NOT NULL,
    customer_id INT REFERENCES customers(id),
    total_quantity INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Draft'
        CHECK (status IN ('Draft','Confirmed','Cancelled')),
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- CHALLAN ITEMS
-- ==========================
CREATE TABLE challan_items (
    id SERIAL PRIMARY KEY,
    challan_id INT REFERENCES challans(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),

    product_name VARCHAR(150),
    sku VARCHAR(50),
    unit_price DECIMAL(10,2),

    quantity INT NOT NULL,
    total_price DECIMAL(10,2)
);