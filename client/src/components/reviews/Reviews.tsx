import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import "./Reviews.scss";
import React, { useEffect, useRef } from "react";
import { addReviewToGig, fetchReviewsForGig } from "../../features/reviews";
import { Review } from "../review";
import { Loader } from "../loader";
import { ReviewData } from "../../types/Review";

interface ReviewsProps {
  gigId: string | undefined;
}

export const Reviews: React.FC<ReviewsProps> = ({ gigId }) => {
  const dispatch = useAppDispatch();
  const { reviewsForGig, loading } = useAppSelector(
    (state: RootState) => state.reviews
  );

  const reviewInputRef = useRef<HTMLInputElement>(null);
  const starSelectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    dispatch(fetchReviewsForGig(gigId));
  }, [gigId, dispatch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data: ReviewData = {
      type: "gig",
      targetId: gigId,
      star: Number(formData.get("star")),
      review: formData.get("review") as string,
    };

    await dispatch(addReviewToGig(data));

    dispatch(fetchReviewsForGig(gigId));

    if (reviewInputRef.current) {
      reviewInputRef.current.value = "";
    }
    if (starSelectRef.current) {
      starSelectRef.current.selectedIndex = 0;
    }
  };

  return (
    <div className="reviews">
      <div className="reviews__body">
        <div className="reviews__wrapper">
          {loading ? (
            <Loader />
          ) : (
            reviewsForGig?.map((rev) => (
              <React.Fragment key={rev._id}>
                <Review review={rev} />
              </React.Fragment>
            ))
          )}
        </div>
        <form className="reviews__addForm" onSubmit={handleSubmit}>
          <input
            ref={reviewInputRef}
            type="text"
            name="review"
            placeholder="Write your review"
            className="form__input input reviews__input"
            required
          />

          <select ref={starSelectRef} name="star" required>
            <option value="">Choose rating</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>

          <div className="reviews__button button-wrapper">
            <button className="button button_lg button_default" type="submit">
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
