import axios from '~/utils/httpRequest';

const postUploadSingleImage = (file) => {
  const form = new FormData();
  form.append('file', file);
  return axios.post('/api/v1/admin/image/upload', form);
};

const postUploadMultiImages = (files) => {
  const form = new FormData();
  files.forEach((file) => {
    form.append('file', file);
  });
  return axios.post('/api/v1/admin/image/upload-multiple', form);
};

export { postUploadSingleImage, postUploadMultiImages };
