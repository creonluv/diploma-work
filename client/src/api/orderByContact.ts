import {
  OrderAction,
  OrderByContract,
  OrderByContractResponse,
} from "../types/OrderByContract";
import { client } from "../utils/fetchClient";

export const createOrder = (
  contractId: string | undefined
): Promise<OrderByContractResponse> => {
  return client.post(`/order-by-contract/create-order/${contractId}`, null);
};

export const confirmOrCancelPayment = (
  data: OrderAction
): Promise<OrderByContract> => {
  return client.post(`/order-by-contract/confirm-or-cancel-payment`, data);
};

export const getOrdersByContract = (
  contractId: string
): Promise<OrderByContract[]> => {
  return client.get(`/order-by-contract/${contractId}`);
};
