import { FilterJobs } from "../../components/filtersJobs/FiltersJobs";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { useEffect } from "react";
import { fetchJobsAsync } from "../../features/job";

import "./JobsCatalogPage.scss";
import { JobCard } from "../../components/jobCard/JobCard";
import { Pagination } from "../../components/pagination/Pagination";
import { useLocation } from "react-router-dom";
import { Loader } from "../../components/loader";

export const JobsCatalogPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { loading, jobs, totalPages, currentPage } = useAppSelector(
    (state: RootState) => state.jobs
  );

  const params = new URLSearchParams(location.search);
  const searchParams = params.toString();

  useEffect(() => {
    dispatch(fetchJobsAsync(searchParams));
  }, [dispatch, searchParams]);

  return (
    <section className="jobscatalog">
      <div className="jobscatalog__container">
        <div className="jobscatalog__body">
          <div className="jobscatalog__background jobscatalog__top">
            <div className="jobscatalog__header">
              <h2 className="jobscatalog__title">All freelance projects</h2>
              <p className="jobscatalog__info">{`${
                jobs?.length || 0
              } projects`}</p>
            </div>
          </div>

          <div className="jobscatalog__background jobscatalog__aside">
            <FilterJobs />
          </div>

          <div className="jobscatalog__jobs">
            {loading ? (
              <Loader />
            ) : (
              jobs?.map((job) => <JobCard key={job._id} job={job} />)
            )}
          </div>

          <div className="jobscatalog__pagination">
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        </div>
      </div>
    </section>
  );
};
