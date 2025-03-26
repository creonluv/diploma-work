import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import React, { useEffect, useRef } from "react";
import { fetchOrdersByContractAsync } from "../../features/orderByContract";
import { ReviewData } from "../../types/Review";

import "./ContractReviews.scss";
import { addReviewUser } from "../../features/reviews";
import { Loader } from "../../components/loader";
import { Review } from "../../components/review";

export const ContractReviewsPage = () => {
  const dispatch = useAppDispatch();
  const { contractId } = useParams();

  const isSeller = localStorage.getItem("isSeller");

  if (!contractId) {
    return <p>Contract not found</p>;
  }

  const { orders, loading } = useAppSelector(
    (state: RootState) => state.orderByContract
  );

  useEffect(() => {
    dispatch(fetchOrdersByContractAsync(contractId));
  }, [contractId, dispatch]);

  const reviewInputRef = useRef<HTMLTextAreaElement>(null);
  const starSelectRef = useRef<HTMLSelectElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!orders) {
      return;
    }

    const to = isSeller ? orders[0].freelancerId : orders[0]?.employerId;

    const formData = new FormData(e.currentTarget);
    const data: ReviewData = {
      type: "user",
      orderId: orders[0]._id,
      targetId: to,
      star: Number(formData.get("star")),
      review: formData.get("review") as string,
    };

    dispatch(addReviewUser(data))
      .then(() => dispatch(fetchOrdersByContractAsync(contractId)))
      .catch((error) => console.error("Помилка:", error));

    if (reviewInputRef.current) {
      reviewInputRef.current.value = "";
    }

    if (starSelectRef.current) {
      starSelectRef.current.selectedIndex = 0;
    }
  };

  return (
    <section className="contractReviewsPage">
      <div className="contractReviewsPage__body">
        <div className="contractReviewsPage__background contractReviewsPage__left">
          <div className="contractDetailsPage__group">
            <label htmlFor="freelancerReview">
              <strong>Freelancer Review</strong>
            </label>
            <input
              type="text"
              id="freelancerReview"
              className="form__input input"
              name="freelancerReview"
              value={orders?.[0]?.reviews?.freelancer ? "Yes" : "No"}
              readOnly
            />
          </div>

          <div className="contractDetailsPage__group">
            <label htmlFor="sellerReview">
              <strong>Seller Review</strong>
            </label>
            <input
              type="text"
              id="sellerReview"
              className="form__input input"
              name="sellerReview"
              value={orders?.[0]?.reviews?.employer ? "Yes" : "No"}
              readOnly
            />
          </div>
        </div>

        <div className="contractReviewsPage__background contractReviewsPage__right">
          <div className="reviews__wrapper">
            {loading ? (
              <Loader />
            ) : orders ? (
              <>
                {orders[0].reviews.employer && (
                  <Review review={orders[0].reviews.employer} />
                )}
                {orders[0].reviews.freelancer && (
                  <Review review={orders[0].reviews.freelancer} />
                )}
              </>
            ) : (
              <p>No reviews available</p>
            )}
          </div>

          <hr className="reviews__line" />

          <form className="reviews__addForm" onSubmit={handleSubmit}>
            <div className="reviews__inputs">
              <textarea
                name="review"
                placeholder="Write your review"
                className="form__input input reviews__input"
                required
              />

              <div className="select-container">
                <select className="rating-select" name="star" required>
                  <option value="">Choose rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>

            <div className="reviews__button button-wrapper">
              <button className="button button_lg button_default" type="submit">
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
