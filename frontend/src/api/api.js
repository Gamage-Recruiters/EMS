import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/'; // Base URL for the backend API

// Create an Axios instance with default settings
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // timeout: 10000, // 10 seconds timeout

})

export default api;

// Request interceptor - add token to all requests
api.interceptors.request.use(
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



