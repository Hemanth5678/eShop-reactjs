import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from '../MiniCart.module.scss';

import { publicRoutes } from '~/routes/routes';

import Item from './Item/Item';
import { formatIndianMoney } from '~/utils/format';

const cx = classNames.bind(styles);

const ContentBox = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cart);

  const totalMoney =
    cart?.items &&
    cart?.items.length > 0 &&
    cart.items.reduce((previous, current) => {
      if (current.product.product.promotion) {
        return previous + current.quantity * current.product.product.discountPrice;
      }
      return previous + current.quantity * current.product.product.price;
    }, 0);

  return (
    <div className={cx('cart__items')}>
      {cart?.items && cart?.items.length > 0 && (
        <>
          <div className={cx('list-items')}>
            {cart?.items.map((item, index) => (
              <Item key={`mini-cart__item-${index}`} item={item} />
            ))}
          </div>
          <div className={cx('cart__total-price', 'flex justify-between py-3')}>
            <span>Total:</span>
            <b>{formatIndianMoney.format(totalMoney)}</b>
          </div>
          <div className={cx('cart__actions', 'grid grid-cols-2 gap-4')}>
            <button onClick={() => navigate(publicRoutes.checkout)}>Checkout</button>
            <button onClick={() => navigate(publicRoutes.cart)}>Cart</button>
          </div>
        </>
      )}
      {cart?.items && cart?.items.length === 0 && <div>No item in cart</div>}
    </div>
  );
};

export default ContentBox;
