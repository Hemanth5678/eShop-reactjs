import axios from '~/utils/httpRequest';

const postRatingProduct = (productId, star, title, content) => {
  return axios.post('/api/v1/rating', {
    productId,
    star,
    title,
    content,
  });
};

const getAllRatingsOfProductWithPaginate = (productId, offset, limit, sortType) => {
  return axios.get(`/api/v1/rating?product-id=${productId}&offset=${offset}&limit=${limit}&sort-type=${sortType}`);
};

export { postRatingProduct, getAllRatingsOfProductWithPaginate };
