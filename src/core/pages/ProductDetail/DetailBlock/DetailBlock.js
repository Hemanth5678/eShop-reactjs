import classNames from 'classnames/bind';
import _ from 'lodash';

import styles from './DetailBlock.module.scss';

import { GiPencilRuler } from 'react-icons/gi';
import { FaPhoneSquare, FaLocationArrow } from 'react-icons/fa';

import selectImg from '~/assets/images/product/select-pro.png';
import { formatIndianMoney } from '~/utils/format';

const cx = classNames.bind(styles);

const DetailBlock = ({
  parentProduct,
  listColors,
  setListColors,
  listProducts,
  setListProducts,
  quantity,
  setQuantity,
  selectedColor,
  selectedProduct,
  handleAddToCart,
}) => {
  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleChangeSize = (newSize) => {
    if (+newSize.variantSizeId !== +selectedProduct.variantSizeId) {
      setListProducts((draft) => {
        for (const product of draft) {
          if (+product.variantSizeId === +selectedProduct.variantSizeId) {
            product.isSelected = false;
          }
          if (+product.variantSizeId === +newSize.variantSizeId) {
            product.isSelected = true;
          }
        }
      });
    }
  };

  const handleChangeColor = (newColor) => {
    if (+newColor.id !== +selectedColor.id) {
      setListColors((draft) => {
        for (const color of draft) {
          if (+color.id === +selectedColor.id) {
            color.isSelected = false;
          }
          if (+color.id === +newColor.id) {
            color.isSelected = true;
          }
        }
      });
      setListProducts((draft) => {
        for (const product of draft) {
          if (+product.color.id === +selectedColor.id && +product.variantSizeId === +selectedProduct.variantSizeId) {
            product.isSelected = false;
          }
          if (+product.color.id === +newColor.id && +product.size.id === +selectedProduct.size.id) {
            product.isSelected = true;
          }
        }
      });
    }
  };

  return (
    <div className={cx('detail-block')}>
      <div className={cx('top')}>
        <h1 className={cx('title')}>{parentProduct?.name ?? 'Loading...'}</h1>
        <div className={cx('sku')}>
          <div className={cx('item')}>
            {'SKU: '}
            {listProducts && listProducts.length > 0
              ? listProducts.map((product) => {
                  if (product.isSelected) {
                    return (
                      <span key={`variant-sku-${product.productId}`} className={cx('variant-sku')}>
                        {product.sku}
                      </span>
                    );
                  }
                })
              : undefined ?? 'Loading...'}
          </div>
          <div className={cx('item')}>
            Vendor: <span className={cx('vendor')}>Ecommerce</span>
          </div>
        </div>
      </div>
      <div className={cx('offer')}>
        <div className={cx('price')}>
          {parentProduct?.promotion !== undefined ? (
            parentProduct.promotion ? (
              <>
                <span className={cx('special')}>{formatIndianMoney.format(parentProduct?.discountPrice)}</span>
                <span className={cx('old')}>{formatIndianMoney.format(parentProduct?.price)}</span>
                <span className={cx('save')}>
                  Save:
                  <span>{formatIndianMoney.format(parentProduct?.price - parentProduct?.discountPrice)}</span>
                </span>
              </>
            ) : (
              <span className={cx('special')}>{formatIndianMoney.format(parentProduct?.price)}</span>
            )
          ) : (
            undefined ?? 'Loading...'
          )}
        </div>
        <div className={cx('inventory-quantity')}>
          <span className={cx('title')}>Status:</span>
          {listProducts && listProducts.length > 0
            ? listProducts.map((product) => {
                if (product.isSelected) {
                  return (
                    <span key={`instock-${product.productId}`} className={cx('in-stock')}>
                      {product.inStock ? 'In Stock' : 'Out of stock'}
                    </span>
                  );
                }
              })
            : undefined ?? 'Loading...'}
        </div>
      </div>
      <div className={cx('select-swatch')}>
        <div className={cx('size')}>
          <div className={cx('header')}>
            <span>Size:</span>
            {/* <button className={cx('size-table')}>
              <GiPencilRuler />
              <span>Size table</span>
            </button> */}
          </div>
          <div className={cx('options')}>
            {_.isEmpty(selectedColor)
              ? undefined ?? 'Loading ...'
              : listProducts &&
                listProducts.length > 0 &&
                listProducts.map((product, index) => {
                  if (+product?.color?.id === +selectedColor.id) {
                    return (
                      <div
                        key={`product-size-option-${product.variantSizeId}-${index}`}
                        className={cx('option', {
                          selected: product?.isSelected,
                        })}
                        onClick={() => handleChangeSize(product)}
                      >
                        {product?.size?.size}
                        {product?.isSelected && <img src={selectImg} alt="checked" />}
                      </div>
                    );
                  }
                })}
          </div>
        </div>
        <div className={cx('color')}>
          <div className={cx('header')}>
            <span>Color:</span>
          </div>
          <div className={cx('options')}>
            {listColors &&
              listColors.length > 0 &&
              listColors.map((color, index) => (
                <div
                  key={`color-${color.name}-${color.id}`}
                  className={cx('option', {
                    selected: color.isSelected,
                  })}
                  onClick={() => handleChangeColor(color)}
                >
                  {color.name}
                  {color.isSelected && <img src={selectImg} alt="checked" />}
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className={cx('quantity-select')}>
        <label>Quantity:</label>
        <div className={cx('custom')}>
          <button className={cx('decrease')} onClick={() => handleDecreaseQuantity()}>
            -
          </button>
          <span>{quantity}</span>
          <button className={cx('increase')} onClick={() => handleIncreaseQuantity()}>
            +
          </button>
        </div>
      </div>
      <div className={cx('btn-buy')}>
        <button
          className={cx({ disabled: !selectedProduct?.inStock })}
          disabled={!selectedProduct?.inStock}
          onClick={() => handleAddToCart()}
        >
          {selectedProduct?.inStock === undefined ? (
            <>
              <span className={cx('txt-main')}>Loading ...</span>
              <span className={cx('txt-add')}>Loading ...</span>
            </>
          ) : selectedProduct.inStock ? (
            <>
              <span className={cx('txt-main')}>
                Add to cart now with price{' '}
                <span>
                  {parentProduct?.promotion !== undefined
                    ? parentProduct.promotion
                      ? formatIndianMoney.format(parentProduct?.discountPrice)
                      : formatIndianMoney.format(parentProduct?.price)
                    : undefined ?? 'Loading...'}
                </span>
              </span>
              <span className={cx('txt-add')}>Order and deliver locally</span>
            </>
          ) : (
            <>
              <span className={cx('txt-main')}>Out of stock</span>
              <span className={cx('txt-add')}>We are really sorry about this problem</span>
            </>
          )}
        </button>
      </div>
      <div className={cx('call')}>
        Order hotline:
        <a href="tel:6362044914" title="6362044914">
          <FaPhoneSquare /> 6362044914
        </a>
        (09:00 - 22:00)
      </div>
      <div className={cx('store-place')}>
        <FaLocationArrow />
        <span>
          See a list of store
          <a href="https://google.com" title="Ecommerce store system here" target={'_blank'} rel="noreferrer">
            here
          </a>
        </span>
      </div>
    </div>
  );
};

export default DetailBlock;
