import { client } from "../utils/fetchClient";

interface CreateOrderGigResponse {
  clientSecret: string;
}

export const createOrderGig = (
  id: string | undefined,
  data = null
): Promise<CreateOrderGigResponse> => {
  return client.post(`/orderGig/create-payment-intent/${id}`, data);
};

export const updateOrderGig = (dataToUpdate: any) => {
  return client.put(`/orderGig/confirm`, dataToUpdate);
};
