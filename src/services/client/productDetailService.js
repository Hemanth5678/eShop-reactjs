import axios from '~/utils/httpRequest';

const getProductDetailBySlug = (slug) => {
  return axios.get(`/api/v1/product-detail?slug=${slug}`);
};

export { getProductDetailBySlug };
