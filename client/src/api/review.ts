import { ReviewData, ReviewType } from "../types/Review";
import { client } from "../utils/fetchClient";

export const getReviews = (): Promise<ReviewType[]> => {
  return client.get(`/reviews`);
};

export const getReviewsForGig = (
  id: string | undefined
): Promise<ReviewType[]> => {
  return client.get(`/reviews?type=gig&targetId=${id}`);
};

export const addReview = (data: ReviewData): Promise<ReviewType> => {
  return client.post(`/reviews/`, data);
};

export const addReviewToUser = (data: ReviewData): Promise<ReviewType> => {
  return client.post(`/reviews/user`, data);
};
