import axios from '~/utils/httpRequest';

const getListCategories = () => {
  return axios.get('/api/v1/admin/category');
};

const putUpdateCategories = (id, newName) => {
  return axios.put('/api/v1/admin/category', {
    id,
    newName,
  });
};

const postCreateNewCategory = (name) => {
  return axios.post('/api/v1/admin/category', {
    name,
  });
};

const deleteCategoryById = (categoryId) => {
  return axios.delete(`/api/v1/admin/category/${categoryId}`);
};

export { getListCategories, putUpdateCategories, postCreateNewCategory, deleteCategoryById };
