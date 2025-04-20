import { useEffect } from "react";
import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUserJobsAsync } from "../../features/job";
import { JobCard } from "../../components/jobCard/JobCard";

import "./JobsByUserPage.scss";

export const JobsByUserPage: React.FC = () => {
  const { jobsByUser, loading, error } = useAppSelector(
    (state: RootState) => state.jobs
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserJobsAsync());
  }, [dispatch]);

  return (
    <section className="jobsbyuser">
      <div className="jobsbyuser__container">
        <div className="jobsbyuser__body">
          <div className="jobsbyuser__top">
            <h2 className="jobsbyuser__title">My all jobs!</h2>
            <p className="jobsbyuser__info">{`${
              jobsByUser?.length || 0
            } projects`}</p>
          </div>

          <div className="jobsbyuser__jobs">
            {jobsByUser?.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
