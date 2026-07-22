import {Request,Response} from "express";
import * as service from "../services/stock.service";


export const stockIn = async(
req:Request,
res:Response
)=>{

try{

const result = await service.stockIn(req.body);


res.status(201).json({
success:true,
data:result
});


}catch(error:any){

res.status(500).json({
success:false,
message:error.message
});

}

};



export const stockOut = async(
req:Request,
res:Response
)=>{

try{

const result = await service.stockOut(req.body);


res.status(201).json({
success:true,
data:result
});


}catch(error:any){

res.status(500).json({
success:false,
message:error.message
});

}

};



export const history = async(
req:Request,
res:Response
)=>{

const result =
await service.history(
Number(req.params.id)
);


res.json({
success:true,
data:result
});


};