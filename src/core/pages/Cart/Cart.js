import { useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './Cart.module.scss';

import { BreadCrumb } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { formatIndianMoney } from '~/utils/format';
import { deCreaseOneProductInCart, inCreaseOneProductInCart, removeProductFromCart } from '~/redux/slice/cartSlice';
import { Link } from 'react-router-dom';
import { publicRoutes } from '~/routes/routes';

const cx = classNames.bind(styles);

const Cart = () => {
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = 'Cart';
  }, []);

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

  const totalMoney =
    cart?.items &&
    cart?.items.length > 0 &&
    cart.items.reduce((previous, current) => {
      if (current.product.product.promotion) {
        return previous + current.quantity * current.product.product.discountPrice;
      }
      return previous + current.quantity * current.product.product.price;
    }, 0);
  const totalItems = cart?.items?.reduce((previous, current) => previous + current.quantity, 0);

  return (
    <div className={cx('cart')}>
      <BreadCrumb current="cart" />
      <div className="container mx-auto max-w-[730px] lg:max-w-[970px] xl:max-w-[1150px] px-3 mb-5">
        <div className={cx('title', 'mt-7')}>
          <h1 className="text-[26px] uppercase">
            Cart <span className="text-[19px] lowercase">({totalItems} products)</span>
          </h1>
        </div>
        <div className="grid grid-cols-12">
          {cart?.items && cart?.items.length === 0 && (
            <div className="col-span-12">
              <div className="flex flex-col items-center mb-5">
                <div className="text-xl my-10">Your cart is empty</div>
                <Link
                  to={`${publicRoutes.collection}/all`}
                  className={cx('bg-black h-[50px] w-[250px] text-white leading-[50px] text-center')}
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          )}
          {cart?.items && cart?.items.length > 0 && (
            <>
              <div className={cx('list-products', 'col-span-12 lg:col-span-9')}>
                <div className={cx('product', 'py-4')}>
                  {cart?.items.map((item, index) => (
                    <div key={`cart-product-${item?.product?.variantSizeId}-${index}`} className="grid grid-cols-12">
                      <div className="col-span-2 lg:col-span-3">
                        <div className={cx('image')}>
                          <img
                            className="lg:max-h-[180px]"
                            src={item?.product?.images && item?.product?.images[0]?.imageUrl}
                            alt={item?.product?.product?.name}
                            title={item?.product?.product?.name}
                          />
                        </div>
                      </div>
                      <div className="col-span-10 lg:col-span-9">
                        <div className={cx('detail flex items-center justify-between lg:justify-start h-full')}>
                          <div className="infor w-[350px]">
                            <p className={cx('name', 'text-sm lg:text-base font-semibold uppercase')}>
                              {`${item?.product?.product?.name} - ${item?.product?.size?.size} / ${item?.product?.color?.name}`}
                            </p>
                            <p className={cx('brands', 'text-sm font-medium text-[#a9a9a9] my-1')}>Brand: YB Shop</p>
                            <div className="mobile-price block lg:hidden text-sm font-normal">
                              Price:{' '}
                              {item?.product?.product?.promotion
                                ? formatIndianMoney.format(item?.product?.product?.discountPrice)
                                : formatIndianMoney.format(item?.product?.product?.price)}
                            </div>
                            <p className={cx('action')}>
                              <button
                                className="hidden lg:block hover:underline"
                                onClick={() => handleRemoveProductOutOfCart(item?.product)}
                              >
                                Delete
                              </button>
                            </p>
                          </div>
                          <div className="price hidden lg:block w-[110px] text-lg font-semibold">
                            {item?.product?.product?.promotion
                              ? formatIndianMoney.format(item?.product?.product?.discountPrice)
                              : formatIndianMoney.format(item?.product?.product?.price)}
                          </div>
                          <div className={cx('quantity-block')}>
                            <div>
                              <button
                                className={cx('decrease')}
                                onClick={() => handleDeCreaseOneProduct(item?.product)}
                              >
                                -
                              </button>
                              <span>{item?.quantity}</span>
                              <button
                                className={cx('increase')}
                                onClick={() => handleInCreaseOneProduct(item?.product)}
                              >
                                +
                              </button>
                            </div>
                            <p
                              className="mobile-action block lg:hidden hover:underline text-center mt-2 cursor-pointer"
                              onClick={() => handleRemoveProductOutOfCart(item?.product)}
                            >
                              Delete
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={cx('cart-submit', 'col-span-12 lg:col-span-3')}>
                <div className={cx('fee')}>
                  <div className={cx('temporarily')}>
                    <span>Temporarily:</span>
                    <span>{formatIndianMoney.format(totalMoney)}</span>
                  </div>
                  <div className={cx('amount')}>
                    <span>Amount:</span>
                    <span>{formatIndianMoney.format(totalMoney)}</span>
                  </div>
                  <Link to={publicRoutes.checkout} className={cx('checkout-btn')}>
                    Pay now
                  </Link>
                  <Link to={`${publicRoutes.collection}/all`} className={cx('continue-shopping-btn')}>
                    Continue shopping
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
