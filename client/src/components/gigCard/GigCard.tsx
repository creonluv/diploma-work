import { Link } from "react-router-dom";
import { Gig } from "../../types/Gig";
import "./GigCard.scss";
import shiny from "../../assets/img/icons/icon/outline/shiny.svg";
import nophoto from "../../assets/img/no-image-icon.png";

interface GigCardProps {
  gig: Gig;
}

export const GigCard: React.FC<GigCardProps> = ({ gig }) => {
  console.log(gig);
  return (
    <Link to={`/gigs/${gig._id}`} className="gigcard">
      <div className="gigcard__coverImgWrapper">
        <img
          className="gigcard__coverImg"
          src={gig.cover ? `http://localhost:8800/api/${gig.cover}` : nophoto}
          alt={gig.shortTitle}
        />
      </div>

      <div className="gigcard__main">
        <div className="gigcard__user">
          <img
            className="gigcard__avatar"
            src={`http://localhost:8800/api${gig.userId.profileImage}`}
            alt={gig.userId.username}
          />
          <h4 className="gigcard__title text-bold">{gig.title}</h4>
        </div>
        <div className="gigcard__information">
          <p>{gig.shortDesc}</p>
        </div>
      </div>

      <hr className="gigcard__line" />

      <div className="gigcard__bottom">
        <div className="gigcard__rating">
          <img src={shiny} alt="rating" />
          <p className="text-light">{gig.rating.toFixed(1)}</p>
        </div>
        <div className="gigcard__price text-bold">${gig.price}</div>
      </div>
    </Link>
  );
};
