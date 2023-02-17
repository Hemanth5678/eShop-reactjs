import axios from '~/utils/httpRequest';

const getSearchAllProductsByProductNameWithPaginate = (query, offset, limit) => {
  return axios.get(`/api/v1/product/search?query=${query}&offset=${offset}&limit=${limit}`);
};

export { getSearchAllProductsByProductNameWithPaginate };
