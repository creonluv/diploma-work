import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { fetchJobAsync } from "../../features/job";
import { addBidToJob, fetchBidsForJob } from "../../features/bids";
import { useMediaQuery } from "react-responsive";

import ProgressBar from "../../components/progressBar/ProgressBar";
import ProgressBarMini from "../../components/progressBar/ProgressBarMini";

import shiny from "../../assets/img/icons/icon/outline/shiny.svg";
import clock from "../../assets/img/icons/clock.svg";
import calendar from "../../assets/img/icons/calendar.svg";
import eye from "../../assets/img/icons/eye.svg";

import "./JobOnePage.scss";
import { BidCard } from "../../components/bid/Bid";
import { Loader } from "../../components/loader";
import { formatDistanceToNow } from "date-fns";

const ResponsiveComponent = () => {
  const isMobile = useMediaQuery({ maxWidth: 1024 });
  return !isMobile ? (
    <ProgressBar currentStep={1} />
  ) : (
    <ProgressBarMini currentStep={1} />
  );
};

export const JobOnePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobId } = useParams<{ jobId: string }>();

  const { job } = useAppSelector((state: RootState) => state.jobs);
  const { bids, loading } = useAppSelector((state: RootState) => state.bids);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [bidData, setBidData] = useState({
    proposal: "",
    bidAmount: "",
    estimatedTime: "",
  });

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobAsync(jobId));
      dispatch(fetchBidsForJob(jobId));
    } else {
      console.error("Job ID is missing.");
    }
  }, [jobId, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBidData({ ...bidData, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setBidData({
      proposal: "",
      bidAmount: "",
      estimatedTime: "",
    });

    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bidAmountNumber = Number(bidData.bidAmount);
    const estimatedTimeNumber = Number(bidData.estimatedTime);

    if (isNaN(bidAmountNumber) || isNaN(estimatedTimeNumber)) {
      console.error("The entered values ​​are not numbers");
      return;
    }

    const data = {
      ...bidData,
      bidAmount: bidAmountNumber,
      estimatedTime: estimatedTimeNumber,
    };

    if (jobId) {
      dispatch(addBidToJob({ id: jobId, data }))
        .then(() => {
          dispatch(fetchBidsForJob(jobId));
          clearForm();
        })
        .catch((error) => {
          console.error("Error adding bid:", error);
        });
    }
  };

  return (
    <section className="jobonepage">
      <div className="jobonepage__container">
        <div className="jobonepage__body">
          <div className="jobonepage__background jobonepage__top">
            <div className="jobonepage__background--top">
              <h3 className="jobonepage__title">{job?.title}</h3>
              <p className="jobonepage__price text-price">{job?.budget} USD</p>
            </div>
            <ResponsiveComponent />
          </div>

          <div className="jobonepage__left">
            <div className="jobonepage__background">
              <h4 className="text-bold">About this job</h4>
              <p>{job?.description}</p>
            </div>

            <div className="jobonepage__background">
              <h4 className="text-bold">Bids</h4>

              <div className="jobonepage__bids">
                {loading ? (
                  <Loader />
                ) : (
                  bids?.map((bid) => <BidCard bid={bid} />)
                )}
              </div>

              <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="bid-button"
              >
                Place a Bid
              </button>

              {isFormOpen && (
                <form onSubmit={handleSubmit} className="jobonepage__bid-form">
                  <textarea
                    name="proposal"
                    value={bidData.proposal}
                    onChange={handleChange}
                    placeholder="Your proposal"
                    className="form__input input"
                    required
                  />
                  <div className="jobonepage__bid-form--block">
                    <input
                      type="number"
                      name="bidAmount"
                      value={bidData.bidAmount}
                      onChange={handleChange}
                      placeholder="Bid Amount (USD)"
                      className="form__input input"
                      required
                    />
                    <input
                      type="number"
                      name="estimatedTime"
                      value={bidData.estimatedTime}
                      onChange={handleChange}
                      placeholder="Estimated Time (days)"
                      className="form__input input"
                      required
                    />
                  </div>
                  <button
                    className="button button_lg button_default"
                    type="submit"
                  >
                    Submit Bid
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="jobonepage__right">
            <div className="jobonepage__background">
              <h4 className="text-bold">Customer</h4>
              <div className="jobonepage__user">
                <img
                  className="jobonepage__avatar"
                  src={`http://localhost:8800/api${job?.employerId.profileId.profileImage}`}
                  alt={job?.employerId.profileId.userId}
                />
                <div className="jobonepage__user-info">
                  <h4 className="text-bold">{job?.employerId.username}</h4>
                  <div className="jobonepage__rating">
                    <p className="text-light">
                      {job?.employerId.profileId.location}
                    </p>
                    <img src={shiny} alt="rating" />
                    <p className="text-light">
                      {job?.employerId.profileId.userRating.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="jobonepage__background">
              <h4 className="text-bold">Project published</h4>

              <div className="jobonepage__points">
                <div className="jobonepage__point">
                  <img className="jobonepage__logo" src={clock} alt="rating" />
                  <p className="text-light">
                    {job?.createdAt
                      ? formatDistanceToNow(new Date(job.createdAt))
                      : "Date unavailable"}{" "}
                    ago
                  </p>
                </div>

                <div className="jobonepage__point">
                  <img className="jobonepage__logo" src={eye} alt="rating" />
                  <p className="text-light">{job?.views}</p>
                </div>
              </div>
            </div>

            <div className="jobonepage__background">
              <h4 className="text-bold">Before closing</h4>

              <div className="jobonepage__point">
                <img className="jobonepage__logo" src={calendar} alt="rating" />
                <p className="text-light">{job?.daysLeft} days</p>
              </div>
            </div>

            <div className="jobonepage__background">
              <h4 className="text-bold">Tags</h4>

              <div className="jobonepage__tags">
                {job?.tags.map((tag) => (
                  <div className="jobonepage__tag" key={tag.name}>
                    ◦ {tag.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
