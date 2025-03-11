import { Link } from "react-router-dom";
import logo from "../../assets/img/icons/logo.svg";
import close from "../../assets/img/icons/close.svg";
import favicon from "../../assets/img/icons/favicon.svg";
import { useAppDispatch } from "../../app/hooks";

import "./Header.scss";
import { useEffect, useState } from "react";
import { useWindowSizeContext } from "../../context/WindowSizeContext";

import cart from "../../assets/img/icons/cart.svg";
import likes from "../../assets/img/icons/likes.svg";
import { AuthModal } from "../authModal";
import { useAuthContext } from "../../context/AuthContext";
import { Profile } from "../../types/Profile";
import { fetchProfileAsync } from "../../features/profile";

export const Header = () => {
  const dispatch = useAppDispatch();

  const [burger, setBurger] = useState(false);
  const [profile, setProfile] = useState<Profile | undefined>();

  const { isAuth } = useAuthContext();

  const { width } = useWindowSizeContext();

  const storedUserId = localStorage.getItem("userId");

  const handleBurger = () => {
    if (width < 768) {
      setBurger(!burger);
      document.body.classList.toggle("_lock");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!storedUserId) {
        console.warn("User ID is not available in localStorage.");
        return;
      }

      try {
        const result = await dispatch(fetchProfileAsync(storedUserId)).unwrap();

        setProfile(result);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchProfile();
  }, [storedUserId]);

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
            <div className="header__navig">
              <div className="header__logo logo">
                <Link className="logo__link" to="/">
                  <picture>
                    <source media="(min-width:480px)" srcSet={logo} />
                    <source media="(max-width:480px)" srcSet={favicon} />
                    <img className="header__logoimage" src={logo} alt="LOGO" />
                  </picture>
                </Link>
              </div>
              {isAuth && (
                <nav className={`header__nav${burger ? " _menu-open" : ""}`}>
                  <button onClick={handleBurger} className="header__close">
                    <img src={close} alt="menu" />
                  </button>
                  <ul className="header__menu menu-header">
                    {profile?.profileType === "freelancer" ? (
                      <li className="menu-header__item">
                        <a
                          href="gigs/by-user"
                          className="menu-header__link"
                          onClick={handleBurger}
                        >
                          All my gigs
                        </a>
                      </li>
                    ) : (
                      <li className="menu-header__item">
                        <a
                          href="jobs/by-user"
                          className="menu-header__link"
                          onClick={handleBurger}
                        >
                          All my jobs
                        </a>
                      </li>
                    )}

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
              )}
            </div>

            <div className="header__left">
              <div className="header__icons">
                {isAuth && (
                  <>
                    <Link className="header__icon" to="/">
                      <img src={likes} alt="likes" />
                    </Link>
                    <Link className="header__icon" to="/">
                      <img src={cart} alt="cart" />
                    </Link>
                    <AuthModal />
                  </>
                )}

                {!isAuth && (
                  <>
                    <Link
                      to="/login"
                      className="button button_sm button_transparent"
                    >
                      <span>Sign in</span>
                    </Link>
                    <Link
                      to="/register"
                      className="button button_sm button_default"
                    >
                      <span>Start for free</span>
                    </Link>
                  </>
                )}
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
