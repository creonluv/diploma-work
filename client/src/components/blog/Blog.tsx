import { Link } from "react-router-dom";

import arrowBlack from "../../assets/img/icons/arrow-black.svg";
import arrowWhite from "../../assets/img/icons/arrow-white.svg";

import play from "../../assets/img/icons/play.svg";

import icon1 from "../../assets/img/blog/icons/icons-1.png";
import icon2 from "../../assets/img/blog/icons/icons-2.png";
import icon3 from "../../assets/img/blog/icons/icons-3.png";

import blog1 from "../../assets/img/blog/blog-1.jpg";
import blog2 from "../../assets/img/blog/blog-2.jpg";
import blog3 from "../../assets/img/blog/blog-3.jpg";

import "./Blog.scss";

export const Blog = () => {
  return (
    <section className="blog">
      <div className="blog__container">
        <div className="blog__body">
          <div className="blog__title-block title-block">
            <h2 className="title-block__title title-2">Our Blog</h2>
            <div className="title-block__button button-wrapper">
              <Link
                className="button button_md button_ghost"
                to="/indevelopment"
              >
                <img className="button__icon" src={arrowBlack} alt="arrow" />
                <span>View All Articles</span>
              </Link>
            </div>
          </div>

          <div className="blog__items">
            <div className="blog__item ibg">
              <img src={blog1} alt="Freelancer working on a laptop" />
              <div className="blog__button button-wrapper">
                <Link
                  className="button button_lg button_default"
                  to="/indevelopment"
                >
                  <span>Read More</span>
                </Link>
              </div>

              <img
                className="blog__imgItem"
                src={blog3}
                alt="Freelancer working on a laptop"
              />

              <div className="blog__content">
                <h3 className="blog__title title-2">
                  5 Tips for Successful Freelance Projects
                </h3>
                <p className="blog__text text-light">
                  Learn how to manage your freelance projects effectively — from
                  planning to delivery.
                </p>
              </div>
              <div className="blog__line"></div>
            </div>

            <div className="blog__item ibg">
              <img src={blog2} alt="Team discussion online" />
              <div className="blog__button button-wrapper">
                <Link
                  className="button button_lg button_default "
                  to="/indevelopment"
                >
                  <span>Watch Video</span>
                </Link>
              </div>
              <div className="blog__content">
                <h3 className="blog__title title-2">
                  How to Build Long-Term Client Relationships
                </h3>
                <p className="blog__text text-light">
                  Explore strategies to keep your clients coming back again and
                  again.
                </p>
              </div>
              <div className="blog__line"></div>
            </div>

            <div className="blog__item ibg">
              <img src={blog3} alt="Creative workspace" />
              <div className="blog__button button-wrapper">
                <Link
                  className="button button_lg button_default"
                  to="/indevelopment"
                >
                  <span>Discover More</span>
                </Link>
              </div>
              <div className="blog__content">
                <p className="blog__text text-light">
                  Our favorite tools and platforms that help freelancers stay
                  productive and organized.
                </p>
              </div>
              <ul className="blog__icons icons">
                <li className="icons__item">
                  <img src={icon1} alt="productivity icon" />
                </li>
                <li className="icons__item">
                  <img src={icon2} alt="tools icon" />
                </li>
                <li className="icons__item">
                  <img src={icon3} alt="organization icon" />
                </li>
              </ul>
              <div className="blog__line blog__line_small"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
