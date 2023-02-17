import axios from '~/utils/httpRequest';

const postCreateNewProduct = ({
  name,
  price,
  description,
  isVisible,
  primaryImageName,
  primaryImageUrl,
  secondaryImageName,
  secondaryImageUrl,
  category,
  sizes,
  colors,
}) => {
  return axios.post('/api/v1/admin/product', {
    name,
    price,
    description,
    isVisible,
    primaryImageName,
    primaryImageUrl,
    secondaryImageName,
    secondaryImageUrl,
    category,
    sizes,
    colors,
  });
};

const getListProductsWithPaginate = (limit, offset) => {
  return axios.get(`/api/v1/admin/product?limit=${limit}&offset=${offset}`);
};

const deleteProductByProductId = (productId) => {
  return axios.delete(`/api/v1/admin/product/${productId}`);
};

const getProductDetailByProductId = (productId) => {
  return axios.get(`/api/v1/admin/product/${productId}`);
};

const putUpdateProductByProductId = (productId, payload) => {
  return axios.put(`/api/v1/admin/product/${productId}`, {
    ...payload,
  });
};

export {
  postCreateNewProduct,
  getListProductsWithPaginate,
  deleteProductByProductId,
  getProductDetailByProductId,
  putUpdateProductByProductId,
};
