import * as repository from "../repositories/product.repository";


export const addProduct = async(product:any)=>{

    return repository.createProduct(product);

};


export const listProducts = async()=>{

    return repository.getProducts();

};


export const editProduct = async(id:number, product:any)=>{

    return repository.updateProduct(id, product);

};


export const removeProduct = async(id:number)=>{

    return repository.deleteProduct(id);

};