import { Outlet } from 'react-router-dom';

import './Store.scss';

import { Footer, Header, Navbar } from '~/core/components';

const Store = () => {
  return (
    <div className="Store">
      <Header />
      <Navbar />
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
};

export default Store;
