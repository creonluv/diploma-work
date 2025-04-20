import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Gig } from "../../types/Gig";
import { getGig } from "../../api/gigs";
import ImageSlider from "../../components/imageSlider/ImageSlider";
import { Reviews } from "../../components/reviews";

import shiny from "../../assets/img/icons/icon/outline/shiny.svg";
import clock from "../../assets/img/icons/clock.png";
import greencheck from "../../assets/img/icons/greencheck.png";

import "./GigOnePage.scss";
import { Loader } from "../../components/loader";

export const GigOnePage: React.FC = () => {
  const [gig, setGig] = useState<Gig | undefined>();
  const [loading, setLoading] = useState(true);

  const { gigId } = useParams();

  useEffect(() => {
    const fetchGig = async () => {
      try {
        setLoading(true);
        const gig = await getGig(gigId);
        setGig(gig);
      } catch (error) {
        console.error("Error fetching gig:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [gigId]);

  return (
    <section className="gigonepage">
      <div className="gigonepage__container">
        {loading ? (
          <Loader />
        ) : (
          <div className="gigonepage__body">
            <div className="gigonepage__top">
              <div className="gigonepage__background">
                <div className="gigonepage__top-content">
                  <h2 className="gigonepage__title">{gig?.title}</h2>
                  <p className="gigonepage__price text-price">
                    {gig?.price || "Not specified"} USD
                  </p>
                </div>
              </div>
            </div>

            <div className="gigonepage__left">
              <div className="gigonepage__background">
                <div className="gigonepage__slider">
                  <ImageSlider images={gig?.images} />
                </div>
              </div>

              <div className="gigonepage__background">
                <div className="gigonepage__title">
                  <h4 className="text-bold">About this gig</h4>
                </div>
                <div className="gigonepage__group">{gig?.desc}</div>
              </div>

              <div className="gigonepage__background">
                <Reviews gigId={gigId} />
              </div>
            </div>

            <div className="gigonepage__right">
              <div className="gigonepage__background">
                <h4 className="text-bold">Buy this gig</h4>

                <Link
                  to={`http://localhost:5173/pay/${gigId}`}
                  className="profile__button button-wrapper"
                >
                  <button className="button button_lg button_default button_full-size">
                    <span>Continue</span>
                  </button>
                </Link>
              </div>
              <div className="gigonepage__background">
                <h4 className="text-bold">About freelancer</h4>

                <div className="gigonepage__user">
                  <img
                    className="gigonepage__avatar"
                    src={`http://localhost:8800/api${gig?.userId.profileImage}`}
                    alt={gig?.userId.username}
                  />
                  <h4 className="text-bold">{gig?.userId.username}</h4>
                  <div className="gigonepage__rating">
                    <img src={shiny} alt="rating" />
                    <p className="text-light">{gig?.rating?.toFixed(1)}</p>
                  </div>
                </div>
              </div>
              <div className="gigonepage__background">
                <h4 className="text-bold">Features</h4>

                {gig?.features.map((feature) => (
                  <div className="features__item" key={feature}>
                    <img className="gigonepage__icon" src={greencheck} alt="" />
                    <span className="text-muted">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="gigonepage__background">
                <h4 className="text-bold">Deadline</h4>

                <div className="gigonepage__days">
                  <img className="gigonepage__icon" src={clock} alt="" />
                  <span>{gig?.deliveryTime} Days Delivery</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
