import { Request, Response } from "express";
import * as service from "../services/customer.service";

export const createCustomer = async (req: Request, res: Response) => {
    try {
        const customer = await service.addCustomer(req.body);

        res.status(201).json({
            success: true,
            data: customer
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to create customer"
        });
    }
};

export const updateCustomer = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const customer = await service.editCustomer(id, req.body);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.json({
            success: true,
            data: customer
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to update customer"
        });
    }
};

export const deleteCustomer = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const deleted = await service.removeCustomer(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.json({
            success: true,
            message: "Customer deleted"
        });
    } catch (err: any) {
        console.error(err);

        if (err.code === "23503") {
            return res.status(409).json({
                success: false,
                message:
                    "Cannot delete: this customer has sales challans linked to them"
            });
        }

        res.status(500).json({
            success: false,
            message: "Unable to delete customer"
        });
    }
};

export const getCustomers = async (_req: Request, res: Response) => {
    try {
        const customers = await service.listCustomers();

        res.json({
            success: true,
            data: customers
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to fetch customers"
        });
    }
};