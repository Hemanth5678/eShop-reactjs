import axios from '~/utils/httpRequest';

const putChangePassword = (userId, oldPassword, newPassword, confirmPassword) => {
  return axios.put(`/api/v1/user/${userId}/change-password`, {
    oldPassword,
    newPassword,
    confirmPassword,
  });
};

const putUpdateUserInformation = (userId, firstName, lastName, phone, address) => {
  return axios.put(`/api/v1/user/${userId}`, {
    firstName,
    lastName,
    phone,
    address,
  });
};

export { putChangePassword, putUpdateUserInformation };
