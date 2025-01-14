import React from "react";
import { useLocation, Link } from "react-router-dom";

import btnBred from "../../assets/img/icons/btn-bread.svg";

import "./BreadCrumbs.scss";

export const BreadСrumbs: React.FC = () => {
  const location = useLocation();

  let currentLink = "";

  const crumbs = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb, index, array) => {
      currentLink += `/${crumb}`;

      const crumbText = crumb.charAt(0).toUpperCase() + crumb.slice(1);
      const isLast = index === array.length - 1;

      return (
        <React.Fragment key={crumb}>
          {index === 0 && (
            <div className="breadcrumbs__first">
              <Link to="/">Home</Link>

              <img src={btnBred} alt="" />
            </div>
          )}

          <div className="breadcrumbs__item">
            <Link to={currentLink}>{crumbText}</Link>
          </div>

          {!isLast && <img src={btnBred} alt="" />}
        </React.Fragment>
      );
    });

  return (
    <section className="breadcrumbs">
      <div className="breadcrumbs__container">
        <div className="breadcrumbs__body">{crumbs}</div>
      </div>
    </section>
  );
};
