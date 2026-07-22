import * as repo from "../repositories/stock.repository";
import pool from "../config/db";


export const stockIn = async(data:any)=>{


    await repo.updateStock(
        data.product_id,
        data.quantity
    );


    return repo.createMovement({
        ...data,
        movement_type:"IN"
    });

};



export const stockOut = async(data:any)=>{


    const product = await pool.query(
        `
        SELECT current_stock
        FROM products
        WHERE id=$1
        `,
        [
            data.product_id
        ]
    );


    if(product.rows.length===0){
        throw new Error("Product not found");
    }


    if(product.rows[0].current_stock < data.quantity){

        throw new Error(
            "Insufficient stock"
        );

    }



    await repo.updateStock(
        data.product_id,
        -data.quantity
    );


    return repo.createMovement({
        ...data,
        movement_type:"OUT"
    });

};



export const history = async(product_id:number)=>{

    return repo.getStockHistory(product_id);

};