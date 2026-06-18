import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api`,
  timeout: 15000,
});

// Request interceptor to automatically add authorization header if token exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const predictNews = async (title, text) => {
  const response = await API.post('/news/predict', { title, text });
  return response.data;
};

export const getHistory = async () => {
  const response = await API.get('/news/history');
  return response.data;
};

export const getAdminStats = async () => {
  const response = await API.get('/admin/stats');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await API.get('/admin/users');
  return response.data;
};

export const deletePredictionRecord = async (id) => {
  const response = await API.delete(`/admin/predictions/${id}`);
  return response.data;
};

export default API;
