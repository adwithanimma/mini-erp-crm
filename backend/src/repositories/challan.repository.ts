import pool from "../config/db";

export const createChallan = async(data:any)=>{

    const result = await pool.query(
        `
        INSERT INTO sales_challans
        (
            customer_id,
            challan_number,
            total_amount,
            created_by
        )
        VALUES($1,$2,$3,$4)
        RETURNING *
        `,
        [
            data.customer_id,
            data.challan_number,
            data.total_amount,
            data.created_by
        ]
    );

    return result.rows[0];

};



export const addChallanItem = async(data:any)=>{

    const result = await pool.query(
        `
        INSERT INTO challan_items
        (
            challan_id,
            product_id,
            quantity,
            unit_price,
            subtotal
        )
        VALUES($1,$2,$3,$4,$5)
        RETURNING *
        `,
        [
            data.challan_id,
            data.product_id,
            data.quantity,
            data.unit_price,
            data.subtotal
        ]
    );

    return result.rows[0];

};



export const getProduct = async(product_id:number)=>{

    const result = await pool.query(
        `
        SELECT *
        FROM products
        WHERE id=$1
        `,
        [
            product_id
        ]
    );

    return result.rows[0];

};



export const updateChallanStatus = async(
    id:number,
    status:string
)=>{

    const result = await pool.query(
        `
        UPDATE sales_challans
        SET status=$1
        WHERE id=$2
        RETURNING *
        `,
        [status, id]
    );

    return result.rows[0];

};



export const getChallans = async()=>{

    const result = await pool.query(
        `
        SELECT 
            sc.*,
            c.customer_name AS customer_name
        FROM sales_challans sc
        JOIN customers c
        ON sc.customer_id = c.id
        ORDER BY sc.id DESC
        `
    );

    return result.rows;

};
export const createStockMovement = async(data:any)=>{

    const result = await pool.query(
        `
        INSERT INTO stock_movements
        (
            product_id,
            quantity,
            movement_type,
            reason,
            created_by
        )
        VALUES($1,$2,'OUT',$3,$4)
        RETURNING *
        `,
        [
            data.product_id,
            data.quantity,
            data.reason,
            data.created_by
        ]
    );


    return result.rows[0];

};
export const updateStock = async(
product_id:number,
quantity:number
)=>{

    await pool.query(
        `
        UPDATE products
        SET current_stock = current_stock - $1
        WHERE id=$2
        `,
        [
            quantity,
            product_id
        ]
    );

};