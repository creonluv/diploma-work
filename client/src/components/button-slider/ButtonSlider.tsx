import "../product-slider/ProductSlider.scss";

import scrollingArrows from "../../assets/img/icons/scrollingArrows.svg";

type Props = {
  scrollPosition: number;
  handlePrevClick: () => void;
  handleNextClick: () => void;
};

export const ButtonSlider: React.FC<Props> = ({
  scrollPosition,
  handlePrevClick,
  handleNextClick,
}) => {
  return (
    <>
      <button
        onClick={handlePrevClick}
        className={`goods__slider ${
          scrollPosition === 0 ? "goods__slider_disabled" : ""
        }`}
      >
        <img className="goods__button" src={scrollingArrows} alt="" />
      </button>

      <button onClick={handleNextClick} className="goods__slider">
        <img
          className={`goods__button goods__button_right`}
          src={scrollingArrows}
          alt=""
        />
      </button>
    </>
  );
};
