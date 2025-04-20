import sale from "../../assets/img/sale/sale-2.jpg";

import "./Sale.scss";

export const Sale = () => {
  return (
    <section className="sale">
      <div className="sale__container">
        <div className="sale__body">
          <div className="sale__img-wrapper">
            <img className="sale__img" src={sale} alt="Freelance Promotion" />
          </div>
          <div className="sale__content">
            <div className="sale__block">
              <h2 className="sale__title title-2">
                Get 35% off on boosting your freelance profile!
              </h2>
              <p className="sale__text text-muted">
                Subscribe to our newsletter and receive a promo code for 35% off
                on promoting your profile, plus a free consultation with a top
                freelancer!
              </p>
            </div>
            <form className="sale__form form-sale" action="#">
              <div className="form-sale__item">
                <input
                  className="form-sale__input text-muted"
                  type="email"
                  name="email"
                  placeholder="Enter your e-mail"
                />
                <button className="form-sale__button" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
