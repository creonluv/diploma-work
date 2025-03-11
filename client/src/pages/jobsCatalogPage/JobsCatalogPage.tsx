import { FilterJobs } from "../../components/filtersJobs/FiltersJobs";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { useEffect, useState } from "react";
import { fetchJobsAsync } from "../../features/job";

import "./JobsCatalogPage.scss";
import { JobCard } from "../../components/jobCard/JobCard";
import { Pagination } from "../../components/pagination/Pagination";
import { useLocation } from "react-router-dom";

export const JobsCatalogPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { jobs, totalPages, currentPage } = useAppSelector(
    (state: RootState) => state.jobs
  );
  // Отримуємо актуальні параметри з URL
  const params = new URLSearchParams(location.search);
  const searchParams = params.toString(); // Тепер searchParams завжди оновлений

  console.log(searchParams); // Лог для перевірки

  useEffect(() => {
    dispatch(fetchJobsAsync(searchParams));
  }, [dispatch, searchParams]); // Тепер searchParams змінюється при зміні URL

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
            {jobs?.map((job) => (
              <JobCard job={job} />
            ))}
          </div>

          <div className="jobscatalog__pagination">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              // setSearchParams={setSearchParams}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
