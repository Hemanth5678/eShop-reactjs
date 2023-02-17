import axios from '~/utils/httpRequest';

const getAllProductWithPaginateAndSort = (offset, limit, sortBase, sortType) => {
  return axios.get(`/api/v1/product/all?offset=${offset}&limit=${limit}&sort-base=${sortBase}&sort-type=${sortType}`);
};

const getAllProductByCategoryNameWithPaginateAndSort = (categoryName, offset, limit, sortBase, sortType) => {
  return axios.get(
    `/api/v1/product?category-name=${categoryName}&offset=${offset}&limit=${limit}&sort-base=${sortBase}&sort-type=${sortType}`,
  );
};

const getNRelatedProductByCategoryId = (categoryId, numberElements) => {
  return axios.get(`/api/v1/product/related?category-id=${categoryId}&number-elements=${numberElements}`);
};

export {
  getAllProductWithPaginateAndSort,
  getAllProductByCategoryNameWithPaginateAndSort,
  getNRelatedProductByCategoryId,
};
