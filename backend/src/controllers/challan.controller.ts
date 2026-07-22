import {Request, Response} from "express";
import * as service from "../services/challan.service";


export const createChallan = async(
    req:Request,
    res:Response
)=>{

    try{

        const result =
        await service.createSalesChallan(req.body);

        res.status(201).json({
            success:true,
            data:result
        });

    }
    catch(error:any){

        console.log(error);

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



export const updateChallanStatus = async(
    req:Request,
    res:Response
)=>{

    try{

        const id = Number(req.params.id);

        const challan =
        await service.changeChallanStatus(
            id,
            req.body.status
        );

        if(!challan){

            return res.status(404).json({
                success:false,
                message:"Challan not found"
            });

        }

        res.json({
            success:true,
            data:challan
        });

    }
    catch(error:any){

        console.log(error);

        res.status(400).json({
            success:false,
            message:error.message
        });

    }

};



export const getChallans = async(
    req:Request,
    res:Response
)=>{

    const result =
    await service.listChallans();

    res.json({
        success:true,
        data:result
    });

};