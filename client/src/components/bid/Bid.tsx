import "./Bid.scss";
import { formatDistanceToNow } from "date-fns";
import { Bid } from "../../types/Bid";
import shiny from "../../assets/img/icons/icon/outline/shiny.svg";
import { useAppDispatch } from "../../app/hooks";
import { ContractInput } from "../../types/Contact";
import { createContractAsync } from "../../features/contract";
import { useEffect, useState } from "react";
import { getUser } from "../../api/user";
import { User } from "../../types/User";
import { updateJobStepAsync } from "../../features/job";
import { useNavigate } from "react-router-dom";

interface ReviewProps {
  bid: Bid;
}

export const BidCard: React.FC<ReviewProps> = ({ bid }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const storedUserId = localStorage.getItem("userId") ?? "";
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser(storedUserId);
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [storedUserId]);

  const createContact = async () => {
    const data: ContractInput = {
      jobId: bid.jobId._id,
      freelancerId: bid.freelancerId._id,
      employerId: storedUserId,
      bidId: bid._id,
      totalAmount: bid.bidAmount,
      agreedDeadline: new Date(
        Date.now() + +bid.estimatedTime * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    try {
      const contract = await dispatch(createContractAsync(data)).unwrap();

      await dispatch(
        updateJobStepAsync({ id: bid.jobId._id, step: 2 })
      ).unwrap();

      navigate(`/contracts/${contract.contract._id}/details`);
    } catch (error) {
      console.error("Error creating contract:", error);
    }
  };

  return (
    <div className={`bid ${bid.status === "rejected" ? "disable" : ""}`}>
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
            {user?.isSeller && user?._id === bid.jobId.employerId && (
              <button className="bid__user-button" onClick={createContact}>
                Accept the bid
              </button>
            )}
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
