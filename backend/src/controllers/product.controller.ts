import { Request, Response } from "express";
import * as service from "../services/product.service";


export const createProduct = async(
    req:Request,
    res:Response
)=>{

    try{

        const product = await service.addProduct(req.body);

        res.status(201).json({
            success:true,
            data:product
        });

    }catch(error){

    console.log(error);

    res.status(500).json({
        success:false,
        message:"Product creation failed"
    });

}

};



export const updateProduct = async(
    req:Request,
    res:Response
)=>{

    try{

        const id = Number(req.params.id);

        const product = await service.editProduct(id, req.body);

        if(!product){

            return res.status(404).json({
                success:false,
                message:"Product not found"
            });

        }

        res.json({
            success:true,
            data:product
        });

    }catch(error){

        console.log(error);

        res.status(500).json({
            success:false,
            message:"Product update failed"
        });

    }

};



export const deleteProduct = async(
    req:Request,
    res:Response
)=>{

    try{

        const id = Number(req.params.id);

        const deleted = await service.removeProduct(id);

        if(!deleted){

            return res.status(404).json({
                success:false,
                message:"Product not found"
            });

        }

        res.json({
            success:true,
            message:"Product deleted"
        });

    }catch(error:any){

        console.log(error);

        if(error.code === "23503"){

            return res.status(409).json({
                success:false,
                message:
                "Cannot delete: this product is used in challans or stock history"
            });

        }

        res.status(500).json({
            success:false,
            message:"Product deletion failed"
        });

    }

};



export const getProducts = async(
    req:Request,
    res:Response
)=>{

    try{

        const products = await service.listProducts();

        res.json({
            success:true,
            data:products
        });

    }catch(error){

        res.status(500).json({
            success:false,
            message:"Unable to fetch products"
        });

    }

};