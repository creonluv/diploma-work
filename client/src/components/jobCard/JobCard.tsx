import { Link } from "react-router-dom";
import { Job } from "../../types/Job";
import "./JobCard.scss";

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Link to={`/jobs/${job._id}`} className="jobcard">
      <div className="jobcard__body">
        <div className="jobcard__titles">
          <h4 className="gigcard__title text-bold">{job.title}</h4>
          <h4 className="gigcard__price text-bold">${job.budget}</h4>
        </div>

        <div className="jobcard__desc">
          <p>{job.description}</p>
        </div>

        <div className="jobcard__bottom">
          <div className="jobcard__user">
            <img
              className="jobcard__avatar"
              src={`http://localhost:8800/api${job.employerId.profileId.profileImage}`}
              alt={job.employerId.username}
            />
            <h4 className="jobcard__title text-bold">
              {job.employerId.username}
            </h4>
          </div>
          ∙<p>{job.cat}</p>∙<p>{job.bids.length} bids</p>
        </div>
      </div>
    </Link>
  );
};
