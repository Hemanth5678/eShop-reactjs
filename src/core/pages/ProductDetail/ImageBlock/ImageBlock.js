import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';

import { RiArrowRightSLine, RiArrowLeftSLine } from 'react-icons/ri';

import './ImageBlock.scss';

const ImageBlock = ({ images, productName }) => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const slider1 = useRef(null);
  const slider2 = useRef(null);

  useEffect(() => {
    setNav1(slider1.current);
    setNav2(slider2.current);
  }, []);

  const settingsSlider2 = {
    slidesToShow: 4,
    focusOnSelect: true,
    swipeToSlide: true,
    infinite: false,
    dots: false,
    nextArrow: <CustomArrow next />,
    prevArrow: <CustomArrow prev />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          arrows: false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className="product-detail-image-block">
      <div className="slider-big-image">
        <Slider asNavFor={nav2} ref={slider1} infinite={false} arrows={false}>
          {images.map((image) => (
            <div key={`image-up-${image.imageId}`}>
              <img src={image.imageUrl} alt="preview" title={productName} />
            </div>
          ))}
        </Slider>
      </div>
      <div className="slider-small-image">
        <Slider {...settingsSlider2} asNavFor={nav1} ref={slider2}>
          {images.map((image) => (
            <img key={`image-down-${image.imageId}`} src={image.imageUrl} alt="preview" title={productName} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

const CustomArrow = (props) => {
  const { prev, next, className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: 'block', color: '#000' }} onClick={onClick}>
      {next && <RiArrowRightSLine />}
      {prev && <RiArrowLeftSLine />}
    </div>
  );
};

export default ImageBlock;
