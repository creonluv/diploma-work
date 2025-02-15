import React from "react";
import { useLocation, Link } from "react-router-dom";

import home from "../../assets/img/icons/home.svg";

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
      const isLast = index === array.length - 1;

      const isID = /^[a-f0-9]{10,}$/i.test(crumb);

      const crumbText = isID
        ? "Details"
        : crumb.charAt(0).toUpperCase() + crumb.slice(1);

      return (
        <React.Fragment key={crumb}>
          {index === 0 && (
            <div className="breadcrumbs__first">
              <Link className="breadcrumbs__home" to="/">
                <img src={home} alt="" />
              </Link>
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
