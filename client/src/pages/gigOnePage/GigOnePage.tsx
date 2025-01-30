import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Gig } from "../../types/Gig";
import { getGig } from "../../api/gigs";
import ImageSlider from "../../components/imageSlider/ImageSlider";
import { Reviews } from "../../components/reviews";

import shiny from "../../assets/img/icons/icon/outline/shiny.svg";
import clock from "../../assets/img/icons/clock.png";
import greencheck from "../../assets/img/icons/greencheck.png";

import "./GigOnePage.scss";

export const GigOnePage: React.FC = () => {
  const [gig, setGig] = useState<Gig | undefined>();

  const { gigId } = useParams();

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const gig = await getGig(gigId);

        setGig(gig);
      } catch (error) {
        console.error("Error fetching gig:", error);
      }
    };

    fetchGig();
  }, []);

  console.dir(gig);

  return (
    <section className="gigonepage">
      <div className="gigonepage__container">
        <div className="gigonepage__body">
          <div className="gigonepage__left item">
            <div className="gigonepage__top">
              <h2 className="gigonepage__title">{gig?.title}</h2>

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

            <div className="gigonepage__slider">
              <ImageSlider images={gig?.images} />
            </div>

            <div className="gigonepage__section">
              <div className="gigonepage__title">
                <h4 className="text-bold">About this gig</h4>
              </div>
              <div className="gigonepage__group">{gig?.desc}</div>
            </div>

            <div className="gigonepage__section">
              <div className="gigonepage__title">
                <h4 className="text-bold">Reviews</h4>
              </div>

              <Reviews gigId={gigId} />
            </div>
          </div>

          <div className="gigonepage__right item right">
            <div className="gigonepage__shortInfo">
              <h4 className="text-bold">{gig?.shortTitle}</h4>
              <h3 className="title-3">${gig?.price}</h3>
            </div>

            <div className="gigonepage__shortMiddle">
              <p className="text-light">{gig?.shortDesc}</p>
            </div>

            <div className="features">
              {gig?.features.map((feature) => (
                <div className="features__item" key={feature}>
                  <img className="gigonepage__icon" src={greencheck} alt="" />
                  <span className="text-muted">{feature}</span>
                </div>
              ))}
            </div>

            <div className="gigonepage__days">
              <img className="gigonepage__icon" src={clock} alt="" />
              <span>{gig?.deliveryTime} Days Delivery</span>
            </div>

            <div className="profile__button button-wrapper">
              <button className="button button_lg button_default button_full-size">
                <span>Continue</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
