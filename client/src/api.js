import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errMsg = (e) => {
  if (e.response?.status === 500 && !e.response?.data?.message) {
    return 'Backend server is unreachable or MongoDB is disconnected. Please start the backend on port 5000.';
  }
  return e.response?.data?.message || e.message;
};
export default api;
