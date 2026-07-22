import pool from "../config/db";

export const createCustomer = async (customer: any) => {
    const result = await pool.query(
        `INSERT INTO customers
        (customer_name,mobile,email,business_name,gst_number,
         customer_type,address,status,follow_up_date,notes)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING *`,
        [
            customer.customer_name,
            customer.mobile,
            customer.email,
            customer.business_name,
            customer.gst_number,
            customer.customer_type,
            customer.address,
            customer.status,
            customer.follow_up_date,
            customer.notes
        ]
    );

    return result.rows[0];
};

export const updateCustomer = async (id: number, customer: any) => {
    const result = await pool.query(
        `UPDATE customers SET
            customer_name=$1, mobile=$2, email=$3, business_name=$4,
            gst_number=$5, customer_type=$6, address=$7, status=$8,
            follow_up_date=$9, notes=$10
         WHERE id=$11
         RETURNING *`,
        [
            customer.customer_name,
            customer.mobile,
            customer.email,
            customer.business_name,
            customer.gst_number,
            customer.customer_type,
            customer.address,
            customer.status,
            customer.follow_up_date,
            customer.notes,
            id
        ]
    );

    return result.rows[0];
};

export const deleteCustomer = async (id: number) => {
    const result = await pool.query(
        "DELETE FROM customers WHERE id=$1 RETURNING id",
        [id]
    );

    return result.rows[0];
};

export const getCustomers = async () => {
    const result = await pool.query(
        "SELECT * FROM customers ORDER BY id DESC"
    );

    return result.rows;
};