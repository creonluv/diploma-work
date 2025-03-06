import "./Bid.scss";
import { formatDistanceToNow } from "date-fns";
import { Bid } from "../../types/Bid";
import shiny from "../../assets/img/icons/icon/outline/shiny.svg";

interface ReviewProps {
  bid: Bid;
}

export const BidCard: React.FC<ReviewProps> = ({ bid }) => {
  return (
    <div className="bid">
      <div className="bid__body">
        <div className="bid__user">
          <div className="bid__user_top">
            <img
              className="bid__avatar"
              src={`http://localhost:8800/api${bid?.freelancerId.profileImage}`}
              alt={"avatar"}
            />
            <div className="bid__user_info">
              <h4 className="text-bold">{bid.freelancerId.username}</h4>
              <p className="text-muted">{bid.freelancerId.email}</p>
            </div>
          </div>

          <div className="bid__user-info">
            <div className="bid__user-label">{bid.estimatedTime} days</div>
            <div className="bid__user-label bid__user-label--price">
              {bid.bidAmount} USD
            </div>
          </div>
        </div>

        <div className="bid__middle">
          <p>{bid.proposal}</p>
        </div>

        <div className="bid__bottom">
          <div className="bid__rating">
            <img src={shiny} alt="rating" />
            <p className="text-light">{bid.freelancerId.userRating}</p>
          </div>
          <p className="bid__time text-muted">
            {formatDistanceToNow(new Date(bid.createdAt))} ago
          </p>{" "}
        </div>
      </div>
    </div>
  );
};
