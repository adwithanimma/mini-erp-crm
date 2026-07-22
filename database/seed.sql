INSERT INTO users(name,email,password,role)
VALUES
('Admin','admin@test.com','$2b$10$dummyhash','ADMIN'),
('Sales User','sales@test.com','$2b$10$dummyhash','SALES'),
('Warehouse User','warehouse@test.com','$2b$10$dummyhash','WAREHOUSE'),
('Accounts User','accounts@test.com','$2b$10$dummyhash','ACCOUNTS');

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