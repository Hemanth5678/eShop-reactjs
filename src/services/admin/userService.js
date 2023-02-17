import axios from '~/utils/httpRequest';

const getListUserByRoleAndStatusWithPaginate = (role, status, offset, limit) => {
  return axios.get(`/api/v1/admin/user?role=${role}&status=${status}&limit=${limit}&offset=${offset}`);
};

const putBlockUserByUserId = (userId) => {
  return axios.put(`/api/v1/admin/user/${userId}/block`);
};

const putUnBlockUserByUserId = (userId) => {
  return axios.put(`/api/v1/admin/user/${userId}/un-block`);
};

const postCreateNewAdminUser = (firstName, lastName, email, phone, password, confirmPassword) => {
  return axios.post('/api/v1/admin/user', {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
  });
};

export { getListUserByRoleAndStatusWithPaginate, putBlockUserByUserId, putUnBlockUserByUserId, postCreateNewAdminUser };
