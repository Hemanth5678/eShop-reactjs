import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useImmer } from 'use-immer';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import classNames from 'classnames/bind';
import _ from 'lodash';

import DetailBlock from './DetailBlock/DetailBlock';
import ImageBlock from './ImageBlock/ImageBlock';
import Tabs from './Tabs/Tabs';
import { AddToCartModal, BreadCrumb, RelatedProduct } from '../../components';
import { Nested } from '../../components/BreadCrumb/BreadCrumb';

import { publicRoutes } from '~/routes/routes';

import { getProductDetailBySlug } from '~/services/client/productDetailService';
import { addProductToCart } from '~/redux/slice/cartSlice';
import { formatIndianMoney } from '~/utils/format';

const ProductDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { type, productname } = useParams();

  const [listImages, setListImages] = useState([]);
  const [listProducts, setListProducts] = useImmer([]);
  const [listColors, setListColors] = useImmer([]);
  const [parentProduct, setParentProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState({});
  const [selectedProduct, setSelectedProduct] = useState({});
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

  useEffect(() => {
    document.title = 'Product';
  }, []);

  useEffect(() => {
    fetchProductBySlug(productname);
  }, [productname]);

  useEffect(() => {
    listColors?.forEach((color) => {
      if (color?.isSelected) {
        setSelectedColor(_.cloneDeep(color));
      }
    });
    listProducts?.forEach((product) => {
      if (product?.isSelected) {
        setSelectedProduct(_.cloneDeep(product));
      }
    });
  }, [listColors, listProducts]);

  const fetchProductBySlug = async (slug) => {
    const response = await getProductDetailBySlug(slug);
    if (response && +response?.code === 0) {
      const listColorsTmp = [];
      let listProductTmp = [];
      let listImagesTmp = [];

      let isSetDefaultSelect = false;
      for (const item of response?.data?.colors) {
        listColorsTmp.push({
          ...item.color,
          isSelected: false,
        });
        listImagesTmp = [...listImagesTmp, ...item?.images];
        // eslint-disable-next-line no-loop-func
        const listProductsReduce = item.sizes.reduce((previous, current) => {
          let isSelected = false;
          if (isSetDefaultSelect === false && current.inStock === true) {
            isSelected = true;
            isSetDefaultSelect = true;
          }
          return [
            ...previous,
            {
              ...current,
              images: [...item.images],
              color: item.color,
              product: response?.data?.product,
              isSelected,
            },
          ];
        }, []);
        listProductTmp = [...listProductTmp, ...listProductsReduce];
      }
      for (const product of listProductTmp) {
        if (product.isSelected) {
          listColorsTmp.forEach((color) => {
            if (+color.id === product.color.id) {
              color.isSelected = true;
            }
          });
          break;
        }
      }
      setListProducts(listProductTmp);
      setParentProduct(response?.data?.product);
      setListColors(listColorsTmp);
      setListImages(listImagesTmp);
    } else {
      navigate(publicRoutes.home);
      toast.error(response?.message);
    }
  };

  const handleAddToCart = () => {
    if (selectedProduct?.inStock) {
      dispatch(
        addProductToCart({
          product: selectedProduct,
          quantity: quantity,
        }),
      );
      setShowAddToCartModal(true);
    }
  };

  return (
    <div className={'product-detail'}>
      <div className="container mx-auto max-w-[730px] lg:max-w-[970px] xl:max-w-[1150px] px-3">
        <BreadCrumb current={productname.slice(0, productname.lastIndexOf('-'))}>
          <Nested path={`${publicRoutes.collection}/${type}`} name={type} />
        </BreadCrumb>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <ImageBlock images={listImages} productName={parentProduct?.name} />
          <DetailBlock
            parentProduct={parentProduct}
            listColors={listColors}
            setListColors={setListColors}
            listProducts={listProducts}
            setListProducts={setListProducts}
            quantity={quantity}
            setQuantity={setQuantity}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            handleAddToCart={handleAddToCart}
          />
        </div>
        <div className="product-tab">
          <Tabs parentProduct={parentProduct} listImages={listImages} />
        </div>
        <div className="product-anchor block md:flex items-center p-3 border border-[#f5f5f5]">
          <div className="flex items-center">
            <div className="image relative w-[100px] h-[100px] mr-3">
              <img
                className="absolute top-0 bottom-0 left-0 right-0 max-h-full w-auto m-auto"
                src={parentProduct.primaryImageUrl}
                alt="Product anchor"
                title={parentProduct.name}
              />
            </div>
            <div className="content">
              <h3 className="font-bold uppercase mr-5">
                {parentProduct?.name === undefined ? 'Loading ...' : parentProduct.name}
              </h3>
              <div className="text-sm font-light">
                Price:{' '}
                <span className="text-lg font-medium">
                  {parentProduct?.promotion !== undefined
                    ? parentProduct.promotion
                      ? formatIndianMoney.format(parentProduct?.discountPrice)
                      : formatIndianMoney.format(parentProduct?.price)
                    : 'Loading...'}
                </span>
              </div>
            </div>
          </div>
          <button
            className={classNames(
              'bg-black text-white block w-full md:w-[250px] mt-4 md:mt-0 ml-auto px-4 py-1 rounded-sm',
              { 'opacity-[0.65]': !selectedProduct?.inStock },
            )}
            disabled={!selectedProduct?.inStock}
            onClick={() => handleAddToCart()}
          >
            {selectedProduct?.inStock === undefined ? (
              <>
                <div className="uppercase font-medium">Loading ...</div>
                <div>Loading ...</div>
              </>
            ) : selectedProduct.inStock ? (
              <>
                <div className="uppercase font-medium">Add to cart</div>
                <div>Delivery to your place</div>
              </>
            ) : (
              <>
                <div className="uppercase font-medium">Out of stock</div>
                <div>Sorry!</div>
              </>
            )}
          </button>
        </div>
        <RelatedProduct parentProduct={parentProduct} />
      </div>
      <AddToCartModal product={selectedProduct} show={showAddToCartModal} setShow={setShowAddToCartModal} />
    </div>
  );
};

export default ProductDetail;
