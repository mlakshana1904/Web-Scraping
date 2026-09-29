import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An error occurred while processing your request.',
      status: error.response?.status || 500,
      code: error.response?.data?.code || 'ERROR',
      fieldErrors: error.response?.data?.fieldErrors || null,
    };
    return Promise.reject(customError);
  }
);

export default apiClient;
