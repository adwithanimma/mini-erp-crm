import pool from "../config/db";


export const updateStock = async(
    product_id:number,
    quantity:number
)=>{

    const result = await pool.query(
        `
        UPDATE products
        SET current_stock = current_stock + $1
        WHERE id=$2
        RETURNING *
        `,
        [
            quantity,
            product_id
        ]
    );

    return result.rows[0];
};



export const createMovement = async(data:any)=>{

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
        VALUES($1,$2,$3,$4,$5)
        RETURNING *
        `,
        [
            data.product_id,
            data.quantity,
            data.movement_type,
            data.reason,
            data.created_by
        ]
    );


    return result.rows[0];

};



export const getStockHistory = async(product_id:number)=>{

    const result = await pool.query(
        `
        SELECT *
        FROM stock_movements
        WHERE product_id=$1
        ORDER BY created_at DESC
        `,
        [
            product_id
        ]
    );


    return result.rows;

};
export const createStockMovement = async(data:any)=>{

    await pool.query(
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
        `,
        [
            data.product_id,
            data.quantity,
            data.reason,
            data.created_by
        ]
    );

};