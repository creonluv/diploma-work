import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import "./GigPage.scss";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import { fetchGigs, setCurrentPage } from "../../features/gig";
import { GigCard } from "../../components/gigCard";
import { GigsHeader } from "../../components/gigsHeader/GigsHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { Gig } from "../../types/Gig";

export const GigPage: React.FC = () => {
  const { gigs, totalPages, currentPage } = useAppSelector(
    (state: RootState) => state.gigs
  );
  const { isAuth } = useAuthContext();

  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
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

  const handlePageChange = (page: number) => {
    const queryParams = new URLSearchParams(location.search);

    dispatch(setCurrentPage(page));

    queryParams.set("page", page.toString());

    navigate({ search: queryParams.toString() });
  };

  return (
    <section className="gig">
      <div className="gig__container">
        <div className="gig__body">
          <GigsHeader gigs={gigs} category={"Explore all gigs!"} />

          <div className="gig__gigs">
            {gigs?.map((gig: Gig) => (
              <div className="gig__card" key={gig._id}>
                <GigCard gig={gig} />
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>{currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
