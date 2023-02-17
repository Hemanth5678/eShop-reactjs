import { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Header.module.scss';

import { publicRoutes } from '~/routes/routes';

import Search from './Search/Search';
import MiniAccount from './MiniAccount/MiniAccount';
import MiniCart from './MiniCart/MiniCart';

import { BsSearch, BsTextLeft } from 'react-icons/bs';

import logo from '~/assets/images/logo.png';

const cx = classNames.bind(styles);

const Header = () => {
  const [isShowSearchBar, setIsShowSearchBar] = useState(false);

  return (
    <header className={cx('header', 'bg-[#FFD56F]', { active: isShowSearchBar })}>
      <Search isShowSearchBar={isShowSearchBar} setIsShowSearchBar={setIsShowSearchBar} />
      <div className="container mx-auto max-w-[730px] lg:max-w-[970px] xl:max-w-[1150px] px-3">
        <div className="h-[76px] grid grid-cols-3 grid-flow-col">
          <div className="flex lg:hidden items-center text-3xl cursor-pointer">
            <BsTextLeft />
          </div>
          <div className="hidden lg:flex items-center font-normal">
            Free shipping for orders over <b className="ml-1 font-semibold">1000 Rs</b>
          </div>
          <div className="flex items-center justify-center">
            <Link to={publicRoutes.home}>
              <img className="h-[40px] md:h-[40px] lg:h-[40px]" src={logo} alt="logo" />
            </Link>
          </div>
          <div className="flex items-center justify-end">
            <a className="hidden lg:flex flex-col items-center justify-center mr-2 " href="tel:6362044914">
              <b className="text-base leading-4">6362044914</b>
              <span className="text-xs">Purchase support</span>
            </a>
            <div className="text-xl ml-6">
              <button onClick={() => setIsShowSearchBar(!isShowSearchBar)}>
                <BsSearch />
              </button>
            </div>
            <MiniAccount />
            <MiniCart />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
