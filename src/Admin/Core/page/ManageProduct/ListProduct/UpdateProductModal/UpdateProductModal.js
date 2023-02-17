import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import _ from 'lodash';

import MainImage from './MainImage/MainImage';
import CustomSelect from './CustomSelect/CustomSelect';
import { getListCategories } from '~/services/admin/categoryService';
import { getListSizes } from '~/services/admin/sizeService';
import { getProductDetailByProductId, putUpdateProductByProductId } from '~/services/admin/productService';
import Validation from '~/utils/validation';
import { postUploadSingleImage } from '~/services/admin/imageService';

const UpdateProductModal = ({ show, setShow, data, setData, fetchListProduct }) => {
  const [isSending, setIsSending] = useState(false);

  const visibleOptions = [
    { value: true, label: 'Yes', isSelected: false },
    { value: false, label: 'No', isSelected: false },
  ];

  const [listCategoryOptions, setListCategoryOptions] = useState([]);
  const [listSizeOptions, setListSizeOptions] = useState([]);
  const [primaryImage, setPrimaryImage] = useImmer({
    file: '',
    uploaded: false,
    previewImage: '',
  });
  const [secondaryImage, setSecondaryImage] = useImmer({
    file: '',
    uploaded: false,
    previewImage: '',
  });
  const [listSizes, setSizes] = useState([]);
  const [category, setCategory] = useState({
    id: '',
    name: '',
  });
  const [product, setProduct] = useImmer({
    productId: '',
    name: '',
    price: 0,
    discountPrice: 0,
    startDateDiscount: '',
    endDateDiscount: '',
    description: '',
    visible: '',
    sku: '',
  });

  useEffect(() => {
    fetchListSizes();
  }, []);

  useEffect(() => {
    fetchListCategories();
  }, []);

  useEffect(() => {
    if (!_.isEmpty(data)) {
      fetchProductDetail();
    }
  }, [data]);

  const fetchProductDetail = async () => {
    const response = await getProductDetailByProductId(data?.productId);
    if (response && +response.code === 0) {
      setProduct({
        ...response?.data?.product,
        sku: response?.data?.colors[0].sizes[0].sku.slice(0, response?.data?.colors[0].sizes[0].sku.indexOf('-')),
      });
      setCategory({
        ...response?.data?.product.category,
      });
      setPrimaryImage((draft) => {
        draft.previewImage = response?.data?.product.primaryImageUrl;
      });
      setSecondaryImage((draft) => {
        draft.previewImage = response?.data?.product.secondaryImageUrl;
      });
      setSizes(
        response?.data?.colors[0].sizes.map((item) => {
          return {
            id: item.size.id,
            size: item.size.size,
          };
        }),
      );
    } else {
      toast.error(response.message);
    }
  };

  const fetchListCategories = async () => {
    const response = await getListCategories();
    if (response && +response?.code === 0) {
      if (response?.data && response?.data?.categories.length === 0) {
        toast.error('Please create at least one category before create new product');
        return;
      }
      const listCategoryOptionsClone = response?.data?.categories.map((category) => {
        return { value: category.id, label: category.name };
      });
      setListCategoryOptions(listCategoryOptionsClone);
    } else {
      toast.error(response?.message);
    }
  };

  const fetchListSizes = async () => {
    const response = await getListSizes();
    if (response && +response.code === 0) {
      if (response?.data && response?.data?.sizes.length === 0) {
        toast.error('Please create at least one size before create new product');
        return;
      }
      const listSizeOptionsClone = response?.data?.sizes.map((size) => {
        return { value: size.id, label: size.size };
      });
      setListSizeOptions(listSizeOptionsClone);
    } else {
      toast.error(response.message);
    }
  };

  const handleChangeCategory = (event) => {
    setCategory({
      id: event.value,
      name: event.label,
    });
  };

  const handleChangeSelectSize = (event) => {
    const listSizeChoosen = event.map((item) => {
      return {
        id: item.value,
        size: item.label,
      };
    });
    setSizes(listSizeChoosen);
  };

  const handleOnChangeInput = (event) => {
    setProduct((draft) => {
      draft[event.target.name] = event.target.value;
    });
  };

  const handleChangeVisibleSelect = (event) => {
    setProduct((draft) => {
      draft.visible = event.value;
    });
  };

  const validateDataBeforeSubmit = () => {
    if (Validation.isEmpty(product.name)) {
      toast.error('Product name is required');
      return false;
    }
    if (Validation.isEmpty(product.price)) {
      toast.error('Price is required');
      return false;
    }
    if (!Validation.isIntegerNumber(product.price) || !Validation.isHigherThanZero(product.price)) {
      toast.error('Price must be an integer number and higher than zero.');
      return false;
    }
    if (!Validation.isIntegerNumber(product.discountPrice) || +product.discountPrice < 0) {
      toast.error('Discount price must be an integer number and equal or higher than zero.');
      return false;
    }
    if (+product.discountPrice > 0 && !product.startDateDiscount) {
      toast.error('Please enter date begin applying discount price.');
      return false;
    }
    if (+product.discountPrice > 0 && new Date() > new Date(product.startDateDiscount)) {
      toast.error('Start date must be after today.');
      return false;
    }
    if (+product.discountPrice > 0 && !product.endDateDiscount) {
      toast.error('Please enter date end applying discount price.');
      return false;
    }
    if (+product.discountPrice > 0 && new Date(product.endDateDiscount) <= new Date(product.startDateDiscount)) {
      toast.error('End date must be after start date.');
      return false;
    }
    if (Validation.isEmpty(product.description)) {
      toast.error('Product description is required');
      return false;
    }
    if (_.isEmpty(listSizes)) {
      toast.error('Product size is required');
      return false;
    }
    if (Validation.isEmpty(product.sku)) {
      toast.error('Prefix SKU is required');
      return false;
    }
    if (_.isEmpty(primaryImage.previewImage)) {
      toast.error('Primary cover image is required');
      return false;
    }
    if (_.isEmpty(secondaryImage.previewImage)) {
      toast.error('Secondary cover image is required');
      return false;
    }
    return true;
  };

  const handleSubmitUpdateProduct = async () => {
    if (validateDataBeforeSubmit()) {
      const payload = {
        id: product.productId,
        name: product.name.trim(),
        price: product.price,
        description: product.description,
        discountPrice: product.discountPrice,
        startDateDiscount: product.discountPrice > 0 ? product.startDateDiscount : '',
        endDateDiscount: product.discountPrice > 0 ? product.endDateDiscount : '',
        primaryImageName: primaryImage.previewImage.slice(
          primaryImage.previewImage.lastIndexOf('/') + 1,
          primaryImage.previewImage.lastIndexOf('?'),
        ),
        primaryImageUrl: primaryImage.previewImage,
        secondaryImageName: secondaryImage.previewImage.slice(
          primaryImage.previewImage.lastIndexOf('/') + 1,
          primaryImage.previewImage.lastIndexOf('?'),
        ),
        secondaryImageUrl: secondaryImage.previewImage,
        isVisible: product.visible,
        sku: product.sku,
        categoryId: category.id,
        sizes: listSizes,
      };

      // Upload image
      setIsSending(true);
      if (primaryImage.file && primaryImage.uploaded === false) {
        const responseUploadImages = await postUploadSingleImage(primaryImage.file);
        if (responseUploadImages && +responseUploadImages.code === 0) {
          payload.primaryImageName = responseUploadImages.data.imageName;
          payload.primaryImageUrl = responseUploadImages.data.imageUrl;
          setPrimaryImage({
            ...primaryImage,
            file: '',
            uploaded: true,
            previewImage: responseUploadImages.data.imageUrl,
          });
        } else {
          toast.error('An error has occurred. Please try again later.');
          return;
        }
      }
      if (secondaryImage.file && secondaryImage.uploaded === false) {
        const responseUploadImages = await postUploadSingleImage(secondaryImage.file);
        if (responseUploadImages && +responseUploadImages.code === 0) {
          payload.secondaryImageName = responseUploadImages.data.imageName;
          payload.secondaryImageUrl = responseUploadImages.data.imageUrl;
          setSecondaryImage({
            ...secondaryImage,
            file: '',
            uploaded: true,
            previewImage: responseUploadImages.data.imageUrl,
          });
        } else {
          toast.error('An error has occurred. Please try again later.');
          return;
        }
      }

      // Send request update product
      const updateResponse = await putUpdateProductByProductId(payload.id, payload);
      if (updateResponse && +updateResponse.code === 0) {
        setShow(false);
        setData({});
        toast.success('Update product successfully.');
      } else {
        toast.error(updateResponse.message);
      }
      setIsSending(false);
    }
  };

  return (
    <div
      className={classNames(
        { flex: show },
        { hidden: !show },
        'update-product-modal',
        'bg-slate-900/[0.5] overflow-y-auto overflow-x-hidden absolute top-0 right-0 left-0 bottom-0 z-50 w-full justify-center items-center',
      )}
    >
      <div className="relative p-4 w-full max-w-full h-auto">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex justify-between items-start px-4 py-3 rounded-t border-b">
            <h3 className="text-xl font-semibold text-black">Update product</h3>
            <button
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={() => {
                setShow(false);
                setData({});
              }}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div className="px-4 py-2 h-[580px]">
            <div className="grid grid-cols-3">
              <div className="col-span-1">
                <div className="p-4 flex flex-col">
                  <div className="mb-4">
                    <label htmlFor="product-name" className="block mb-2 text-base font-medium text-gray-900 ">
                      Product name (<span className="text-red-600">*</span>):
                    </label>
                    <input
                      type="text"
                      id="product-name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter product name"
                      name="name"
                      value={product.name}
                      onChange={(event) => handleOnChangeInput(event)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="product-price" className="block mb-2 text-base font-medium text-gray-900 ">
                      Price (<span className="text-red-600">*</span>):
                    </label>
                    <input
                      type="text"
                      id="product-price"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter price"
                      name="price"
                      value={product.price}
                      onChange={(event) => handleOnChangeInput(event)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="product-discount-price" className="block mb-2 text-base font-medium text-gray-900 ">
                      Discount Price (<span className="text-red-600">*</span>):
                    </label>
                    <input
                      type="text"
                      id="product-discount-price"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter discount price"
                      name="discountPrice"
                      value={product.discountPrice}
                      onChange={(event) => handleOnChangeInput(event)}
                    />
                  </div>
                  {product.discountPrice > 0 && (
                    <>
                      <div className="mb-4">
                        <label
                          htmlFor="product-start-date-discount"
                          className="block mb-2 text-base font-medium text-gray-900 "
                        >
                          Start date discount (<span className="text-red-600">*</span>):
                        </label>
                        <input
                          type="date"
                          id="product-start-date-discount"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          name="startDateDiscount"
                          value={
                            product.startDateDiscount ? /\d{4}-\d{2}-\d{2}/.exec(product.startDateDiscount)[0] : ''
                          }
                          onChange={(event) => handleOnChangeInput(event)}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="product-end-date-discount"
                          className="block mb-2 text-base font-medium text-gray-900 "
                        >
                          End date discount (<span className="text-red-600">*</span>):
                        </label>
                        <input
                          type="date"
                          id="product-end-date-discount"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          name="endDateDiscount"
                          value={product.endDateDiscount ? /\d{4}-\d{2}-\d{2}/.exec(product.endDateDiscount)[0] : ''}
                          onChange={(event) => handleOnChangeInput(event)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <div className="p-4">
                  <div className="flex gap-8">
                    {/* Primary image */}
                    <div className="w-1/2">
                      <MainImage title={'Primary cover image'} image={primaryImage} setImage={setPrimaryImage} />
                    </div>
                    {/* Secondary image */}
                    <div className="w-1/2">
                      <MainImage title={'Secondary cover image'} image={secondaryImage} setImage={setSecondaryImage} />
                    </div>
                  </div>
                </div>
                <div className="px-4 mt-2 grid grid-cols-2 gap-8">
                  <div className="mb-4">
                    <label htmlFor="product-description" className="block mb-2 text-base font-medium text-gray-900 ">
                      Description (<span className="text-red-600">*</span>):
                    </label>
                    <input
                      type="text"
                      id="product-description"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter description"
                      name="description"
                      value={product.description}
                      onChange={(event) => handleOnChangeInput(event)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-base font-medium text-gray-900 ">
                      Show product in shop? (<span className="text-red-600">*</span>)
                    </label>
                    <CustomSelect
                      value={visibleOptions.find((item) => item.value === product.visible)}
                      options={visibleOptions}
                      onChange={handleChangeVisibleSelect}
                      placeholder={'Select visible...'}
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-3 px-4">
                <div className="grid grid-cols-3 gap-8">
                  <div className="mb-4">
                    <label className="block mb-2 text-base font-medium text-gray-900 ">
                      Select size (<span className="text-red-600">*</span>):
                    </label>
                    <CustomSelect
                      value={listSizeOptions.filter((size) => {
                        for (let i = 0; i < listSizes.length; i++) {
                          if (listSizes[i].id === size.value) {
                            return size;
                          }
                        }
                      })}
                      isMulti
                      options={listSizeOptions}
                      onChange={handleChangeSelectSize}
                      placeholder={'Select size...'}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-base font-medium text-gray-900 ">
                      Select category (<span className="text-red-600">*</span>):
                    </label>
                    <CustomSelect
                      value={listCategoryOptions.find((item) => item.value === category.id)}
                      options={listCategoryOptions}
                      onChange={handleChangeCategory}
                      placeholder={'Select category...'}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="product-sku" className="block mb-2 text-base font-medium text-gray-900 ">
                      Prefix SKU:
                    </label>
                    <input
                      disabled
                      type="text"
                      id="product-sku"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter prefix sku"
                      name="sku"
                      value={product.sku}
                      onChange={(event) => handleOnChangeInput(event)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-1 space-x-2 rounded-b border-t border-gray-200">
            <button
              className="w-32 my-2 mb-2 font-medium text-white bg-black hover:bg-slate-900 py-2"
              onClick={() => {
                setShow(false);
                setData({});
              }}
            >
              Cancel
            </button>
            <button
              className="w-32 my-2 mb-2 font-medium text-white bg-green-600 hover:bg-green-700 py-2"
              disabled={isSending}
              onClick={() => handleSubmitUpdateProduct()}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductModal;
