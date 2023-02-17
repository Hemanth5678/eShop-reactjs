import { useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './MiniCart.module.scss';
import LocalMallIcon from "@material-ui/icons/LocalMall";

import { BsCart } from 'react-icons/bs';

import ContentBox from './ContentBox/ContentBox';

const cx = classNames.bind(styles);

const MiniCart = () => {
  const cart = useSelector((state) => state.cart.cart);

  const totalItems = cart?.items?.reduce((previous, current) => previous + current.quantity, 0);

  return (
    <div className={cx('mini-cart', 'ml-6')}>
      <div className={cx('total-items')}>{totalItems}</div>
      <LocalMallIcon className={cx('text-2xl')} />
      <ContentBox />
    </div>
  );
};

export default MiniCart;
