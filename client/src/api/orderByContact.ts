import {
  OrderAction,
  OrderByContract,
  OrderByContractResponse,
  OrderByUser,
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

export const getOrderByPaymentIntent = (
  paymentIntentId: string
): Promise<OrderByContract> => {
  return client.get(`/order-by-contract/payment-intent/${paymentIntentId}`);
};

export const getOrdersByUser = (): Promise<OrderByUser[]> => {
  return client.get(`/order-by-contract/my`);
};
