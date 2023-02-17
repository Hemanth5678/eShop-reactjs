import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Navbar.module.scss';

import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

import { publicRoutes } from '~/routes/routes';
import { useEffect, useState } from 'react';
import { getListCategories } from '~/services/client/categoryService';

const cx = classNames.bind(styles);

const Navbar = () => {
  const navHome = {
    title: 'Home page',
    path: `${publicRoutes.home}`,
  };

  const navCollections = {
    title: 'Products',
    path: `${publicRoutes.collection}/all`,
  };

  const navInformations = {
    title: 'Information',
    path: '',
    items: [
      {
        title: 'Contact',
        path: '',
      },
      {
        title: 'Shop system',
        path: '',
      },
      {
        title: 'Payment Guide',
        path: '',
      },
    ],
  };

  const [listCategories, setListCategories] = useState([]);

  useEffect(() => {
    fetchListCategories();
  }, []);

  const fetchListCategories = async () => {
    const response = await getListCategories();
    if (response && +response.code === 0) {
      setListCategories(response?.data?.categories);
    }
  };

  return (
    <nav className={cx('main-nav', 'container mx-auto hidden lg:block lg:max-w-[970px] xl:max-w-[1150px] px-3')}>
      <div className="grid grid-cols-3">
        <div className={cx('nav-item')}>
          <Link className={cx('nav-link')} to={navHome.path}>
            {navHome.title}
          </Link>
        </div>
        <div className={cx('nav-item')}>
          <Link className={cx('nav-link')} to={navCollections.path}>
            Products <MdOutlineKeyboardArrowDown className={cx('arrow-down')} />
          </Link>
          <ul className={cx('list-items')}>
            {listCategories &&
              listCategories.length > 0 &&
              listCategories.map((category, index) => (
                <li key={`collections-${category.name}-${index}`} className={cx('item')}>
                  <Link
                    className={cx('link')}
                    to={`${publicRoutes.collection}/${String(category.name).replace(/ /g, '-').toLowerCase()}`}
                  >
                    {String(category.name).toUpperCase()}
                  </Link>
                </li>
              ))}
            {listCategories && listCategories.length === 0 && <li className={cx('item')}>Empty</li>}
          </ul>
        </div>
        <div className={cx('nav-item')}>
          <Link className={cx('nav-link')} to={navInformations.path}>
            {navInformations.title} <MdOutlineKeyboardArrowDown className={cx('arrow-down')} />
          </Link>
          <ul className={cx('list-items')}>
            {navInformations.items.map((item, index) => (
              <li key={`information-${item.title}-${index}`} className={cx('item')}>
                <Link className={cx('link')} to={item.path}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
