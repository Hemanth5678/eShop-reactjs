import axios from '~/utils/httpRequest';

const getListColors = () => {
  return axios.get('/api/v1/admin/color');
};

const putUpdateColor = (id, newName) => {
  return axios.put('/api/v1/admin/color', {
    id,
    newName,
  });
};

const postCreateNewColor = (name) => {
  return axios.post('/api/v1/admin/color', {
    name,
  });
};

const deleteColorById = (colorId) => {
  return axios.delete(`/api/v1/admin/color/${colorId}`);
};

export { getListColors, putUpdateColor, postCreateNewColor, deleteColorById };
