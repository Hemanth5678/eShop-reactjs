import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Item.module.scss';

import { VscTrash } from 'react-icons/vsc';
import { publicRoutes } from '~/routes/routes';
import { deCreaseOneProductInCart, inCreaseOneProductInCart, removeProductFromCart } from '~/redux/slice/cartSlice';
import { formatIndianMoney } from '~/utils/format';

const cx = classNames.bind(styles);

const Item = ({ item }) => {
  const dispatch = useDispatch();

  const handleInCreaseOneProduct = (product) => {
    dispatch(
      inCreaseOneProductInCart({
        product,
      }),
    );
  };

  const handleDeCreaseOneProduct = (product) => {
    dispatch(
      deCreaseOneProductInCart({
        product,
      }),
    );
  };

  const handleRemoveProductOutOfCart = (product) => {
    dispatch(
      removeProductFromCart({
        product,
      }),
    );
  };

  return (
    <div className={cx('item')}>
      <Link
        to={`${publicRoutes.collection}/${String(item?.product?.product?.category?.name).toLowerCase()}/${
          item?.product?.product?.slug
        }`}
        className={cx('link')}
      >
        <img
          className={cx('image')}
          src={item?.product?.images && item?.product?.images[0].imageUrl}
          alt={item?.product?.product?.name}
          title={item?.product?.product?.name}
        />
      </Link>
      <div className={cx('detail')}>
        <Link
          to={`${publicRoutes.collection}/${String(item?.product?.product?.category?.name).toLowerCase()}/${
            item?.product?.product?.slug
          }`}
          className={cx('title', 'uppercase')}
          title={`${item?.product?.product?.name} - ${item?.product?.size?.size} / ${item?.product?.color?.name}`}
        >
          {item?.product?.product?.name}
        </Link>
        <p className={cx('price')}>
          {item?.product?.product?.promotion
            ? formatIndianMoney.format(item?.product?.product?.discountPrice)
            : formatIndianMoney.format(item?.product?.product?.price)}
        </p>
        <div className={cx('quantity-select')}>
          <button className={cx('decrese')} onClick={() => handleDeCreaseOneProduct(item?.product)}>
            -
          </button>
          <span>{item?.quantity}</span>
          <button className={cx('increase')} onClick={() => handleInCreaseOneProduct(item?.product)}>
            +
          </button>
        </div>
      </div>
      <VscTrash
        className={cx('delete', 'text-2xl cursor-pointer')}
        onClick={() => handleRemoveProductOutOfCart(item?.product)}
      />
    </div>
  );
};

export default Item;
