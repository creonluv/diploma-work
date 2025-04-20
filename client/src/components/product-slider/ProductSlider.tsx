import { useCallback, useEffect, useRef, useState } from "react";
import "./ProductSlider.scss";
import { useWindowSizeContext } from "../../context/WindowSizeContext";
import { ButtonSlider } from "../button-slider";
import { SliderIndicator } from "./slider-indicator";
import { Gig } from "../../types/Gig";
import { GigCard } from "../gigCard";

type Props = {
  gigs?: Gig[] | null;
};

const ITEMS_GAP = 16;

const breakpoints = [
  { minWidth: 1024, cards: 4 },
  { minWidth: 768, cards: 3 },
  { minWidth: 480, cards: 2 },
];

export const ProductSlider: React.FC<Props> = ({ gigs }) => {
  const { width } = useWindowSizeContext();

  const productsRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [productWidth, setProductWidth] = useState(0);

  const getCardsInView = (width: number): number => {
    return breakpoints.find((bp) => width >= bp.minWidth)?.cards ?? 1;
  };

  const updateCardsInView = () => {
    if (productsRef.current) {
      const card = productsRef.current.querySelector(".goods__card");

      if (card) {
        const width = card.getBoundingClientRect().width;
        setProductWidth(width);

        setScrollPosition(0);
      }
    }
  };

  const handlePrevClick = useCallback(() => {
    if (productsRef.current) {
      setScrollPosition((prev) => Math.max(prev - productWidth - ITEMS_GAP, 0));
    }
  }, [productWidth]);

  const handleNextClick = useCallback(() => {
    if (productsRef.current && gigs) {
      const maxScrollPosition =
        gigs.length * (productWidth + ITEMS_GAP) -
        productsRef.current.offsetWidth;

      setScrollPosition((prev) => {
        if (prev + productWidth + ITEMS_GAP >= maxScrollPosition) {
          return 0;
        }
        return Math.min(prev + productWidth + ITEMS_GAP, maxScrollPosition);
      });
    }
  }, [productWidth, gigs?.length]);

  useEffect(() => {
    updateCardsInView();

    window.addEventListener("resize", updateCardsInView);

    return () => {
      window.removeEventListener("resize", updateCardsInView);
    };
  }, [gigs]);

  useEffect(() => {
    console.log(scrollPosition);
  }, [scrollPosition]);

  return (
    <section className="goods">
      <div className="goods__container">
        <div className="goods__body">
          <div className="goods__header">
            <h2 className="goods__title title-2">Best gigs for you</h2>
            <div className="goods__buttons">
              <ButtonSlider
                scrollPosition={scrollPosition}
                handlePrevClick={handlePrevClick}
                handleNextClick={handleNextClick}
              />
            </div>
          </div>
          <div className="goods__cards_wrapper">
            <div
              className="goods__cards"
              ref={productsRef}
              style={{
                transform: `translateX(-${scrollPosition}px)`,
                transition: "transform 0.3s ease",
              }}
            >
              {gigs?.map((gig) => (
                <div key={gig._id} className="goods__card">
                  <GigCard gig={gig} />
                </div>
              ))}
            </div>
          </div>
          <SliderIndicator
            totalCards={gigs?.length || gigs?.length || 0}
            startIndex={Math.floor(scrollPosition / productWidth)}
            cardsInView={getCardsInView(width)}
          />
        </div>
      </div>
    </section>
  );
};
