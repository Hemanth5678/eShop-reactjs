import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import _ from 'lodash';

import MainImage from './MainImage/MainImage';
import CustomSelect from './CustomSelect/CustomSelect';
import SelectColor from './SelectColor/SelectColor';
import Validation from '~/utils/validation';
import { getListCategories } from '~/services/admin/categoryService';
import { getListSizes } from '~/services/admin/sizeService';
import { postCreateNewProduct } from '~/services/admin/productService';
import { postUploadMultiImages } from '~/services/admin/imageService';

const CreateNewProduct = () => {
  const isVisibleOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ];
  const initListColors = [
    {
      id: uuidv4(),
      name: '',
      images: [],
    },
  ];

  const [listCategoryOptions, setListCategoryOptions] = useState([]);
  const [listSizeOptions, setListSizeOptions] = useState([]);
  const [primaryImage, setPrimaryImage] = useImmer({
    file: '',
    previewImage: '',
  });
  const [secondaryImage, setSecondaryImage] = useImmer({
    file: '',
    previewImage: '',
  });
  const [listColors, setListColors] = useImmer(initListColors);
  const [listSizes, setSizes] = useState([]);
  const [category, setCategory] = useState({
    id: '',
    name: '',
  });
  const [product, setProduct] = useImmer({
    productName: '',
    productPrice: '',
    productDescription: '',
    isVisible: '',
    productSku: '',
  });
  const [isResetField, setIsResetField] = useState(true);

  useEffect(() => {
    fetchListSizes();
  }, []);

  useEffect(() => {
    fetchListCategories();
  }, []);

  const clearDataAfterCreate = () => {
    setProduct({
      productName: '',
      productPrice: '',
      productDescription: '',
      isVisible: '',
      productSku: '',
    });
    setListColors(initListColors);
    setPrimaryImage({
      file: '',
      previewImage: '',
    });
    setSecondaryImage({
      file: '',
      previewImage: '',
    });
    setSizes([]);
    setCategory({
      id: '',
      name: '',
    });
    setIsResetField(!isResetField);
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

  const handleAddNewColor = () => {
    setListColors((draft) => {
      draft.push({
        id: uuidv4(),
        name: '',
        images: [],
      });
    });
  };

  const handleOnChangeInput = (event) => {
    setProduct((draft) => {
      draft[event.target.name] = event.target.value;
    });
  };

  const handleChangeIsVisibleSelect = (event) => {
    setProduct((draft) => {
      draft.isVisible = event.value;
    });
  };

  const validateData = () => {
    if (Validation.isEmpty(product.productName)) {
      toast.error('Product name is required');
      return false;
    }
    if (Validation.isEmpty(product.productPrice)) {
      toast.error('Product price is required');
      return false;
    }
    if (!Validation.isIntegerNumber(product.productPrice) || !Validation.isHigherThanZero(product.productPrice)) {
      toast.error('Invalid price');
      return false;
    }
    if (Validation.isEmpty(product.productDescription)) {
      toast.error('Product description is required');
      return false;
    }
    if (Validation.isEmpty(product.isVisible)) {
      toast.error('Product visible is required');
      return false;
    }
    if (_.isEmpty(listSizes)) {
      toast.error('Product size is required');
      return false;
    }
    if (Validation.isEmpty(category.id)) {
      toast.error('Category is required');
      return false;
    }
    if (Validation.isEmpty(product.productSku)) {
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
    for (let i = 0; i < listColors.length; i++) {
      if (_.isEmpty(listColors[i].name)) {
        toast.error('Please select color for Color ' + (i + 1));
        return false;
      }
      if (listColors[i].images.length <= 0) {
        toast.error('Please add at least 1 image for Color ' + (i + 1));
        return false;
      }
    }
    return true;
  };

  const handleSubmitCreateNewProduct = async () => {
    const isValid = validateData();
    if (!isValid) {
      toast.error('Please fill all required fields before submitting.');
    } else {
      // Todo: Fix recall API upload image when meet error

      let primaryImageName = '';
      let primaryImageUrl = '';
      let secondaryImageName = '';
      let secondaryImageUrl = '';

      // Call API upload image
      const listImageFiles = [primaryImage.file, secondaryImage.file];
      const responseUploadImages = await postUploadMultiImages(listImageFiles);
      if (responseUploadImages && +responseUploadImages.code === 0) {
        for (let i = 0; i < responseUploadImages.data.length; i++) {
          if (i === 0) {
            primaryImageName = responseUploadImages.data[i].imageName;
            primaryImageUrl = responseUploadImages.data[i].imageUrl;
          }
          if (i === 1) {
            secondaryImageName = responseUploadImages.data[i].imageName;
            secondaryImageUrl = responseUploadImages.data[i].imageUrl;
          }
        }
      }

      // Call API upload image of each color
      const listColorsClone = _.cloneDeep(listColors);
      for (let color of listColorsClone) {
        const listImageFiles = color.images.map((image) => image.file);
        const responseUploadImage = await postUploadMultiImages(listImageFiles);
        if (responseUploadImage && +responseUploadImage.code === 0) {
          color.images = responseUploadImage.data.map((item) => {
            return {
              imageName: item.imageName,
              imageUrl: item.imageUrl,
            };
          });
        }
      }

      const listColorsSendAPI = listColorsClone.map((item) => {
        return {
          sku: product.productSku.trim().toUpperCase(),
          color: {
            id: item.id,
            name: item.name,
          },
          images: item.images,
          sizes: listSizes,
        };
      });

      const payload = {
        name: product.productName.trim().toUpperCase(),
        price: product.productPrice,
        description: product.productDescription,
        isVisible: product.isVisible,
        primaryImageName: primaryImageName,
        primaryImageUrl: primaryImageUrl,
        secondaryImageName: secondaryImageName,
        secondaryImageUrl: secondaryImageUrl,
        category: category,
        colors: listColorsSendAPI,
      };

      const response = await postCreateNewProduct(payload);
      if (response && +response.code === 0) {
        clearDataAfterCreate();
        toast.success('Create new product successfully');
      } else {
        toast.error(response.message);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-129px)] overflow-y-auto">
      <div className="content">
        <div className="border rounded-md p-3 mb-6">
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
                    name="productName"
                    value={product.productName}
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
                    name="productPrice"
                    value={product.productPrice}
                    onChange={(event) => handleOnChangeInput(event)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="product-description" className="block mb-2 text-base font-medium text-gray-900 ">
                    Description (<span className="text-red-600">*</span>):
                  </label>
                  <input
                    type="text"
                    id="product-description"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter description"
                    name="productDescription"
                    value={product.productDescription}
                    onChange={(event) => handleOnChangeInput(event)}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-base font-medium text-gray-900 ">
                    Show product after created (<span className="text-red-600">*</span>):
                  </label>
                  <CustomSelect
                    keyChange={`is-visible-${isResetField}`}
                    options={isVisibleOptions}
                    onChange={handleChangeIsVisibleSelect}
                    placeholder={'Select visible...'}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="p-4 h-full">
                <div className="flex justify-end mb-4">
                  <button
                    className="bg-blue-600 text-white rounded-lg px-3 py-2"
                    onClick={() => handleSubmitCreateNewProduct()}
                  >
                    Create new product
                  </button>
                </div>
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
            </div>
            <div className="col-span-3 px-4">
              <div className="grid grid-cols-3 gap-8">
                <div className="mb-4">
                  <label className="block mb-2 text-base font-medium text-gray-900 ">
                    Select size (<span className="text-red-600">*</span>):
                  </label>
                  <CustomSelect
                    keyChange={`select-size-${isResetField}`}
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
                    keyChange={`select-category-${isResetField}`}
                    options={listCategoryOptions}
                    onChange={handleChangeCategory}
                    placeholder={'Select category...'}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="product-sku" className="block mb-2 text-base font-medium text-gray-900 ">
                    Prefix SKU (<span className="text-red-600">*</span>):
                  </label>
                  <input
                    type="text"
                    id="product-sku"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter prefix sku"
                    name="productSku"
                    value={product.productSku}
                    onChange={(event) => handleOnChangeInput(event)}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-3 px-4">
              <label className="block mb-2 text-base font-medium text-gray-900 ">
                Product colors (<span className="text-red-600">*</span>):
              </label>
              <SelectColor listColors={listColors} setListColors={setListColors} />
              <button
                className="rounded-md bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2"
                onClick={() => handleAddNewColor()}
              >
                Add color
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewProduct;
