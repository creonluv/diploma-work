import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import logo from "../../assets/img/icons/logo.svg";
import close from "../../assets/img/icons/close.svg";
import favicon from "../../assets/img/icons/favicon.svg";
import "./Footer.scss";

export const Footer = () => {
  const { isAuth } = useAuthContext();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__body">
          <div className="footer__main">
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
                <nav className={`header__nav`}>
                  <button className="header__close">
                    <img src={close} alt="menu" />
                  </button>
                  <ul className="header__menu menu-header">
                    <li className="menu-header__item">
                      <a href="/gigs-by-user" className="menu-header__link">
                        All my gigs
                      </a>
                    </li>

                    <li className="menu-header__item">
                      <a href="/" className="menu-header__link">
                        Explore
                      </a>
                    </li>

                    <li className="menu-header__item">
                      <a href="/" className="menu-header__link">
                        Find new project
                      </a>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="footer__top"></div>
    </footer>
  );
};
