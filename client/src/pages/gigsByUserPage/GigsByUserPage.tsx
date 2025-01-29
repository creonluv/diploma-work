import { useEffect } from "react";
import { GigUserCard } from "../../components/gigUserCard";
import { RootState } from "../../app/store";

import "./GigsByUserPage.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchGigsByUser } from "../../features/gig";

export const GigsByUserPage: React.FC = () => {
  const gigsByUser = useAppSelector(
    (state: RootState) => state.gigs.gigsByUser
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchGigsByUser());
  }, [dispatch]);

  console.log(gigsByUser);

  return (
    <section className="gigsbyuser">
      <div className="gigsbyuser__container">
        <div className="gigsbyuser__body">
          <div className="gigsbyuser__top">
            <h2 className="gigsbyuser__title">My all gigs!</h2>
            <p className="gigsbyuser__info">{`${
              gigsByUser?.length || 0
            } projects`}</p>
          </div>

          <div className="gigsbyuser__gigs">
            {gigsByUser?.map((gig) => (
              <div key={gig._id}>
                <GigUserCard gig={gig} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
