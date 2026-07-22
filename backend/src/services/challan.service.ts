import * as repo from "../repositories/challan.repository";


export const createSalesChallan = async(data:any)=>{

    let total = 0;


    // 1. Validate products and calculate total
    for(const item of data.items){

        const product =
        await repo.getProduct(item.product_id);


        if(!product){

            throw new Error(
                "Product not found"
            );

        }


        if(product.current_stock < item.quantity){

            throw new Error(
                `${product.product_name} insufficient stock`
            );

        }


        item.unit_price =
        Number(product.unit_price);


        item.subtotal =
        item.quantity *
        item.unit_price;


        total += item.subtotal;

    }



    // 2. Create Challan
    const challan =
    await repo.createChallan({

        customer_id:data.customer_id,

        challan_number:
        "CH-" + Date.now(),

        total_amount:total,

        created_by:data.created_by

    });



    // 3. Add Items + Update Stock + Create Movement Log
    for(const item of data.items){


        // Save challan items
        await repo.addChallanItem({

            challan_id:challan.id,

            product_id:item.product_id,

            quantity:item.quantity,

            unit_price:item.unit_price,

            subtotal:item.subtotal

        });



        // Reduce inventory
        await repo.updateStock(

            item.product_id,

            item.quantity

        );



        // Create OUT stock movement
        await repo.createStockMovement({

            product_id:item.product_id,

            quantity:item.quantity,

            reason:
            `Sales Challan ${challan.challan_number}`,

            created_by:data.created_by

        });


    }



    return challan;

};





export const listChallans = async()=>{

    return repo.getChallans();

};



const ALLOWED_STATUSES =
["CREATED","DISPATCHED","DELIVERED","CANCELLED"];


export const changeChallanStatus = async(
    id:number,
    status:string
)=>{

    if(!ALLOWED_STATUSES.includes(status)){

        throw new Error(
            "Invalid status. Allowed: " +
            ALLOWED_STATUSES.join(", ")
        );

    }

    return repo.updateChallanStatus(id, status);

};