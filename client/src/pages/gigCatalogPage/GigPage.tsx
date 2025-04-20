import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import "./GigPage.scss";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import { fetchGigs } from "../../features/gig";
import { GigCard } from "../../components/gigCard";
// import { GigsHeader } from "../../components/gigsHeader/GigsHeader";
import { useLocation } from "react-router-dom";
import { Gig } from "../../types/Gig";
import { categories } from "../../helpers/categories";
import { Pagination } from "../../components/pagination/Pagination";
import { FilterGigs } from "../../components/filtersGigs/FiltersGigs";
import { Loader } from "../../components/loader";

export const GigPage: React.FC = () => {
  const { gigs, totalPages, currentPage, loading } = useAppSelector(
    (state: RootState) => state.gigs
  );
  const { isAuth } = useAuthContext();

  const dispatch = useAppDispatch();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const cat = params.get("cat") || "";
  const searchParams = params.toString();

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchGigs(searchParams));
    }
  }, [location.search, dispatch, isAuth, currentPage, searchParams]);

  return (
    <section className="gig">
      <div className="gig__container">
        <div className="gig__body">
          <div className="gig__background gig__top">
            <div className="gig__header">
              <h2 className="gig__title">{`Explore all ${
                categories[cat] ? categories[cat] : ""
              } gigs!`}</h2>
              <p className="gig__info">{`${gigs?.length || 0} projects`}</p>
            </div>
          </div>

          <div className="gig__background gig__aside">
            <FilterGigs />
          </div>

          <div className="gig__gigs">
            <div className="gig__gigsCard">
              {loading ? (
                <Loader />
              ) : (
                gigs?.map((gig: Gig) => (
                  <div className="gig__card" key={gig._id}>
                    <GigCard gig={gig} />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="gig__pagination">
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        </div>
      </div>
    </section>
  );
};
