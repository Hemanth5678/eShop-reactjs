import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.scss';

import slider1 from '~/assets/images/carousel/slider1.png';
import slider2 from '~/assets/images/carousel/slider2.png';
import slider3 from '~/assets/images/carousel/slider3.png';

const Carousel = () => {
  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 4000,
    customPaging: () => <div className="custom-dot"></div>,
    responsive: [
      {
          breakpoint: 1080,
          settings: {
              slidesToShow: 3,
          },
      },
      {
          breakpoint: 720,
          settings: {
              slidesToShow: 2,
          },
      },
      {
          breakpoint: 480,
          settings: {
              slidesToShow: 1,
          },
      },
  ],
  };

  return (
    <Slider {...settings}>

      <Link to={'/collection/all'}>
        <img src={slider1} className="slider-img" alt="carousel" title="Product" />
      </Link>
      <Link to={'/collection/all'}>
        <img src={slider2} className="slider-img" alt="carousel" title="Product" />
      </Link>
      <Link to={'/collection/all'}>
        <img src={slider3} className="slider-img" alt="carousel" title="Product" />
      </Link>
    </Slider>
  );
};

export default Carousel;
