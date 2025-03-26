import { ReviewType } from "../../types/Review";
import star from "../../assets/img/icons/star.png";
import "./Review.scss";
import { formatDistanceToNow } from "date-fns";

interface ReviewProps {
  review: ReviewType;
}

export const Review: React.FC<ReviewProps> = ({ review }) => {
  console.log(review);
  return (
    <div className="review">
      <div className="review__body">
        <div className="review__user">
          <div className="review__user_top">
            <img
              className="review__avatar"
              src={`http://localhost:8800/api${review?.raterUserId.profileImage}`}
              alt={"avatar"}
            />
            <div className="review__user_info">
              <h4 className="text-bold">{review?.raterUserId.username}</h4>
              <p className="text-muted">{review?.raterUserId.email}</p>
            </div>
          </div>

          <p className="text-muted">
            {formatDistanceToNow(new Date(review?.createdAt))} ago
          </p>
        </div>

        <div className="review__rating">
          <div className="review__rate">
            {Array(review?.star)
              .fill(null)
              .map((_, i) => (
                <img className="review__star" src={star} alt="rating" key={i} />
              ))}
            <p className="text-light">{review?.star}</p>
          </div>
          <p className="text-light">{review?.review}</p>
        </div>
      </div>
    </div>
  );
};
