import { useEffect } from 'react';

import { BsTruck } from 'react-icons/bs';
import { GiCardboardBox } from 'react-icons/gi';
import { FiPhoneCall } from 'react-icons/fi';
import { BiStoreAlt } from 'react-icons/bi';

import { Carousel, Service, HomeCategory } from '../../components';
import Collection from '../Collection/Collection';


const Home = () => {
  useEffect(() => {
    document.title = 'Home';
  }, []);

  return (
    <div className="container mx-auto max-w-[730px] lg:max-w-[970px] xl:max-w-[1150px] px-3">
      <div className="home-slider">
        <Carousel />
        {/* <Collection/> */}
        Find By categories
        <HomeCategory/>
      </div>

      <div className="home-service">
        <div className="grid grid-cols-1 md:grid-cols-4">
          <Service link="#" Icon={BsTruck} title="Free ship" desc="With bill from 1000 Rs" />
          <Service
            link="#"
            Icon={GiCardboardBox}
            title="10 days product exchange"
            desc="Exchange products within 10 days"
          />
          <Service
            link="#"
            Icon={FiPhoneCall}
            title="Purchase (9 am - 10 pm IST)"
            desc="Hotline for purchase 6362044914"
          />
          <Service url="#" Icon={BiStoreAlt} title="Shop system" desc="1 store in the whole system" />
        </div>
      </div>
    </div>
  );
};

export default Home;
