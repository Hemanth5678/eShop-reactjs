import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './BreadCrumb.module.scss';

import { RiArrowRightSLine } from 'react-icons/ri';

import { publicRoutes } from '~/routes/routes';

const cx = classNames.bind(styles);

const BreadCrumb = ({ current = '', children }) => {
  return (
    <div className={cx('bread-crumb')}>
      <div className="container mx-auto max-w-[730px] lg:max-w-[970px] xl:max-w-[1150px] px-3">
        <ul className={cx('list-items')}>
          <li className={cx('item', 'link')}>
            <Link to={publicRoutes.home}>Home page</Link>
          </li>
          {children}
          <li className={cx('item', 'active')}>
            <span>
              <RiArrowRightSLine />
            </span>
            <strong>{current}</strong>
          </li>
        </ul>
      </div>
    </div>
  );
};

export const Nested = ({ path = '', name = '' }) => {
  return (
    <li className={cx('item', 'link')}>
      <span>
        <RiArrowRightSLine />
      </span>
      <Link to={path}>{name.toUpperCase()}</Link>
    </li>
  );
};

export default BreadCrumb;
