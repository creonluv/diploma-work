import bg from "../../assets/img/mainscreen/bg.jpg";

import "./MainScreen.scss";

export const MainScreen = () => {
  return (
    <section className="mainscreen">
      <div className="mainscreen__container">
        <div className="mainscreen__body">
          <div className="mainscreen__background">
            <h1 className="mainscreen__title title-1">
              Taskify — Get work done.
            </h1>
            <div className="mainscreen__content">
              <img className="mainscreen__img" src={bg} alt="bg.jpg" />
              <div className="mainscreen__block">
                <div className="mainscreen__text">
                  <h4 className="mainscreen__text-reverse">
                    Connect with top
                    <wbr />
                    freelance talent
                  </h4>
                </div>
                <div className="mainscreen__text">
                  <h4 className="mainscreen__text-reverse">
                    Hire fast. Work smarter.
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
