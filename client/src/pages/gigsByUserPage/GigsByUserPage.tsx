import { useEffect, useState } from "react";
import { getGigByUser } from "../../api/gigs";
import { Gig } from "../../types/Gig";
import { GigUserCard } from "../../components/gigUserCard";

import "./GigsByUserPage.scss";

export const GigsByUserPage: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[] | undefined>();

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const gigs = await getGigByUser();

        setGigs(gigs);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchGigs();
  }, []);

  return (
    <section className="gigsbyuser">
      <div className="gigsbyuser__container">
        <div className="gigsbyuser__body">
          <div className="gigsbyuser__top">
            <h2 className="gigsbyuser__title">My all gigs!</h2>
            <p className="gigsbyuser__info">{`${
              gigs?.length || 0
            } projects`}</p>
          </div>

          <div className="gigsbyuser__gigs">
            {gigs?.map((gig) => (
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
