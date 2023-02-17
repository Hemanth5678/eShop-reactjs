import axios from '~/utils/httpRequest';

const postLogin = (email, password) => {
  return axios.post('/api/v1/login', {
    email,
    password,
  });
};

const postRegisterNewAccount = ({ firstName, lastName, phone, email, password }) => {
  return axios.post('/api/v1/register', {
    firstName,
    lastName,
    phone,
    email,
    password,
  });
};

export { postLogin, postRegisterNewAccount };
