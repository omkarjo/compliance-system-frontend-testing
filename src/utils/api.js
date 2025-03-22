import { logoutUser } from "@/store/slices/userSlice";
import store from "@/store/store";
import axios from "axios";

// Environment configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const baseConfig = {
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  },
};

const logout = () => {
  store.dispatch(logoutUser());
};

const api = axios.create(baseConfig);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

const apiWithAuth = axios.create(baseConfig);

apiWithAuth.interceptors.request.use((config) => {
  const token = store.getState().user.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiWithAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

export { api, apiWithAuth };
export default api;