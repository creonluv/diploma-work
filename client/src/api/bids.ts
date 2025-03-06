import { Bid, BidInput } from "../types/Bid";
import { client } from "../utils/fetchClient";

export const createBid = (
  id: string | undefined,
  data: BidInput
): Promise<Bid> => {
  return client.post(`/bid/${id}`, data);
};

export const getBids = (id: string | undefined): Promise<Bid[]> => {
  return client.get(`/bid/${id}`);
};

export const deleteBid = (id: string) => {
  return client.delete(`/bid/${id}`);
};
