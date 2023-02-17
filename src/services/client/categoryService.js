import axios from '~/utils/httpRequest';

const getListCategories = () => {
  return axios.get('/api/v1/category');
};

export { getListCategories };
