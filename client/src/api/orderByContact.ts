import { OrderByContractResponse } from "../types/OrderByContract";
import { client } from "../utils/fetchClient";

export const createOrder = (
  id: string | undefined
): Promise<OrderByContractResponse> => {
  return client.post(`/order-by-contract/create-order/${id}`, null);
};
