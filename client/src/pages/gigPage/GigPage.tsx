import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import "./GigPage.scss";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import { fetchGigs } from "../../features/gig";
import { GigCard } from "../../components/gigCard";
import { GigsHeader } from "../../components/gigsHeader/GigsHeader";
import { useLocation } from "react-router-dom";
import { Gig } from "../../types/Gig";
import { categories } from "../../helpers/categories";
import { Pagination } from "../../components/pagination/Pagination";

export const GigPage: React.FC = () => {
  const { gigs, totalPages, currentPage } = useAppSelector(
    (state: RootState) => state.gigs
  );
  const { isAuth } = useAuthContext();

  const dispatch = useAppDispatch();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const cat = queryParams.get("cat") || "";

  useEffect(() => {
    const filters = {
      cat: queryParams.get("cat") || "",
      sort: queryParams.get("sort") || "",
      min: queryParams.get("min") || "",
      max: queryParams.get("max") || "",
      page: currentPage.toString(),
    };

    if (isAuth) {
      dispatch(fetchGigs(filters));
    }
  }, [location.search, dispatch, isAuth, currentPage]);

  return (
    <section className="gig">
      <div className="gig__container">
        <div className="gig__body">
          <GigsHeader
            gigs={gigs}
            category={`Explore all ${categories[cat]} gigs!`}
          />

          <div className="gig__gigs">
            {gigs?.map((gig: Gig) => (
              <div className="gig__card" key={gig._id}>
                <GigCard gig={gig} />
              </div>
            ))}
          </div>

          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      </div>
    </section>
  );
};
