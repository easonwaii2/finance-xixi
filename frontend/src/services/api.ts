import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "/api/v1/",
  headers: {
    'Content-Type': 'application/json'
  }
});

// Set default authorization header if token exists
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log(`API Request [${config.method?.toUpperCase()}] ${config.url}`);
    console.log('Token status:', token ? 'Present' : 'Missing');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.url === "/auth/login") {
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
      const formData = new URLSearchParams();
      formData.append('username', config.data.username);
      formData.append('password', config.data.password);
      config.data = formData.toString();
      console.log('Login request prepared');
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    
    if (config.method?.toLowerCase() !== 'get') {
      console.log('Request payload:', typeof config.data === 'string' ? 'encoded form data' : config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      if (window.location.pathname !== '/login') {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
