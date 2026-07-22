-- Demo users. Password for ALL of them is: admin123
-- (bcrypt hash below — safe to publish; change before any real deployment)
INSERT INTO users(name,email,password,role)
VALUES
('Admin','admin@test.com','$2b$10$iVhCcLGJM4Q5XG8aXnzS2.71KrfCOEBixkCqPtGcYwcbHHK1N209q','ADMIN'),
('Sales User','sales@test.com','$2b$10$iVhCcLGJM4Q5XG8aXnzS2.71KrfCOEBixkCqPtGcYwcbHHK1N209q','SALES'),
('Warehouse User','warehouse@test.com','$2b$10$iVhCcLGJM4Q5XG8aXnzS2.71KrfCOEBixkCqPtGcYwcbHHK1N209q','WAREHOUSE'),
('Accounts User','accounts@test.com','$2b$10$iVhCcLGJM4Q5XG8aXnzS2.71KrfCOEBixkCqPtGcYwcbHHK1N209q','ACCOUNTS');

INSERT INTO customers(
customer_name,mobile,email,business_name,
customer_type,address,status)
VALUES
(
'ABC Traders',
'9876543210',
'abc@test.com',
'ABC Pvt Ltd',
'Wholesale',
'Hyderabad',
'Active'
);

INSERT INTO products(
product_name,
sku,
category,
unit_price,
current_stock,
minimum_stock,
warehouse_location
)
VALUES
(
'Wireless Mouse',
'WM001',
'Electronics',
699.00,
100,
10,
'Warehouse A'
);