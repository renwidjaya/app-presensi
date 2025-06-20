import LocalStorageService from "../utils/storage";
import axios, { AxiosResponse, AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Inject bearer token before each request
api.interceptors.request.use(
  (config) => {
    const token = LocalStorageService.getToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Optional: global response/error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // TODO: implement logout or token refresh
      LocalStorageService.clear();
      // e.g. window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
