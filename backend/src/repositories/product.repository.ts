import pool from "../config/db";

export const createProduct = async (product: any) => {

    const result = await pool.query(
        `
        INSERT INTO products
        (
            product_name,
            sku,
            category,
            unit_price,
            current_stock,
            minimum_stock,
            warehouse_location
        )
        VALUES($1,$2,$3,$4,$5,$6,$7)
        RETURNING *
        `,
        [
            product.product_name,
            product.sku,
            product.category,
            product.unit_price,
            product.current_stock,
            product.minimum_stock,
            product.warehouse_location
        ]
    );

    return result.rows[0];
};


export const updateProduct = async (id: number, product: any) => {

    const result = await pool.query(
        `
        UPDATE products SET
            product_name=$1,
            sku=$2,
            category=$3,
            unit_price=$4,
            current_stock=$5,
            minimum_stock=$6,
            warehouse_location=$7
        WHERE id=$8
        RETURNING *
        `,
        [
            product.product_name,
            product.sku,
            product.category,
            product.unit_price,
            product.current_stock,
            product.minimum_stock,
            product.warehouse_location,
            id
        ]
    );

    return result.rows[0];
};


export const deleteProduct = async (id: number) => {

    const result = await pool.query(
        "DELETE FROM products WHERE id=$1 RETURNING id",
        [id]
    );

    return result.rows[0];
};


export const getProducts = async () => {

    const result = await pool.query(
        `
        SELECT * 
        FROM products
        ORDER BY id DESC
        `
    );

    return result.rows;
};