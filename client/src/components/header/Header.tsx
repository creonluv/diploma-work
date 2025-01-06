import { Link } from "react-router-dom";
import logo from "../../assets/img/icons/logo.svg";
import close from "../../assets/img/icons/close.svg";
import favicon from "../../assets/img/icons/favicon.svg";

import "./Header.scss";
import { useState } from "react";
import { useWindowSizeContext } from "../../context/WindowSizeContext";

import cart from "../../assets/img/icons/cart.svg";
import likes from "../../assets/img/icons/likes.svg";
import { AuthModal } from "../authModal";

export const Header = () => {
  const [burger, setBurger] = useState(false);

  const { width } = useWindowSizeContext();

  const handleBurger = () => {
    if (width < 768) {
      setBurger(!burger);
      document.body.classList.toggle("_lock");
    }
  };

  return (
    <header className="header">
      <div className="header__top">
        <div className="header__container">
          <div className="header__top-body">
            <div className="header__select select">
              <select className="select__items" name="lang">
                <option className="select__item" value="en">
                  En
                </option>
                <option className="select__item" value="ua">
                  Ua
                </option>
                <option className="select__item" value="de">
                  De
                </option>
                <option className="select__item" value="fr">
                  Fr
                </option>
                <option className="select__item" value="es">
                  Es
                </option>
              </select>
            </div>
            <Link to="/indevelopment">Help</Link>
          </div>
        </div>
      </div>
      <div className="header__container">
        <div className="header__body">
          <div className="header__main">
            <div className="header__logo logo">
              <Link className="logo__link" to="/">
                <picture>
                  <source media="(min-width:480px)" srcSet={logo} />
                  <source media="(max-width:480px)" srcSet={favicon} />
                  <img className="header__logoimage" src={logo} alt="LOGO" />
                </picture>
              </Link>
            </div>
            <div className="header__left">
              <nav className={`header__nav${burger ? " _menu-open" : ""}`}>
                <button onClick={handleBurger} className="header__close">
                  <img src={close} alt="menu" />
                </button>
                <ul className="header__menu menu-header">
                  <li className="menu-header__item">
                    <a
                      href="/"
                      className="menu-header__link"
                      onClick={handleBurger}
                    >
                      All my gigs
                    </a>
                  </li>

                  <li className="menu-header__item">
                    <a
                      href="/"
                      className="menu-header__link"
                      onClick={handleBurger}
                    >
                      Explore
                    </a>
                  </li>

                  <li className="menu-header__item">
                    <a
                      href="/"
                      className="menu-header__link"
                      onClick={handleBurger}
                    >
                      Find new project
                    </a>
                  </li>
                </ul>
              </nav>
              <div className="header__icons">
                <Link className="header__icon" to="/">
                  <img src={likes} alt="likes" />
                </Link>
                <Link className="header__icon" to="/">
                  <img src={cart} alt="cart" />
                </Link>
                <AuthModal />
              </div>
            </div>
            <div
              className={`header__burger burger${burger ? " _menu-open" : ""}`}
              onClick={handleBurger}
            >
              <div className="burger__line"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
