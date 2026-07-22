import * as repository from "../repositories/customer.repository";

export const addCustomer = async (customer: any) => {
    return repository.createCustomer(customer);
};

export const listCustomers = async () => {
    return repository.getCustomers();
};

export const editCustomer = async (id: number, customer: any) => {
    return repository.updateCustomer(id, customer);
};

export const removeCustomer = async (id: number) => {
    return repository.deleteCustomer(id);
};