import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ImageSlider.scss";

interface ImageSliderProps {
  images: string[] | undefined;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <button></button>,
    prevArrow: <button></button>,
  };

  return (
    <Slider {...settings} className="slick-slider">
      {images?.map((image, index) => (
        <div className="slick-slider-wrapper" key={index}>
          <img
            src={`http://localhost:8800/api/${image}`}
            alt={`slider-${index}`}
            className="slick-slide-image"
          />
        </div>
      ))}
    </Slider>
  );
};

export default ImageSlider;
