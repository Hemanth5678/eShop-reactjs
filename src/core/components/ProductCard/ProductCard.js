import classNames from 'classnames/bind';
import styles from './ProductCard.module.scss';

import { Link, useNavigate } from 'react-router-dom';

import { BsLink45Deg } from 'react-icons/bs';
// import { FaCartArrowDown, FaCartPlus } from 'react-icons/fa';

import { publicRoutes } from '~/routes/routes';

const cx = classNames.bind(styles);

const ProductCard = ({ product, type }) => {
  const navigate = useNavigate();

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    // These options are needed to round to whole numbers if that's what you want.
    // minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  const handleClickOption = () => {
    navigate(`${publicRoutes.collection}/${type}/${product?.slug}`, {
      state: {
        product,
        type,
      },
    });
  };

  return (
    <div className={cx('product-block')} title={'Product'}>
      <div className={cx('thumb')}>
        <Link
          state={{ product }}
          className={cx('primary-img')}
          to={`${publicRoutes.collection}/${type}/${product?.slug}`}
        >
          <img src={product?.primaryImageUrl} alt="primary-img" title={product?.name} />
        </Link>
        <Link
          state={{ product }}
          className={cx('secondary-img')}
          to={`${publicRoutes.collection}/${type}/${product?.slug}`}
        >
          <img src={product?.secondaryImageUrl} alt="secondary-img" title={product?.name} />
        </Link>
        {product?.promotion && (
          <div className={cx('label')}>
            <span className={cx('sale')}>
              {Math.round(((+product?.price - +product?.discountPrice) / +product?.price) * 100)}%
            </span>
          </div>
        )}
        <div className={cx('cart-wrap')}>
          <button className={cx('cart-button')} title="Option" onClick={() => handleClickOption()}>
            <BsLink45Deg />
          </button>
          {/* <button className={cx('cart-button')}>
            <FaCartArrowDown />
          </button>
          <button className={cx('cart-button')}>
            <FaCartPlus />
          </button> */}
        </div>
      </div>
      <div className={cx('content')}>
        <div className={cx('name')}>
          <h4>
            <Link state={{ product }} to={`${publicRoutes.collection}/${type}/${product?.slug}`}>
              {String(product?.name).toUpperCase()}
            </Link>
          </h4>
        </div>
        <div className={cx('price')}>
          {product?.promotion ? (
            <>
              <span className={cx('current')}>{formatter.format(product?.discountPrice)}</span>
              <span className={cx('old')}>{formatter.format(product?.price)}</span>
            </>
          ) : (
            <span className={cx('current')}>{formatter.format(product?.price)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
