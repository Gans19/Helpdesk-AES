import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: false
});

let accessToken = null;
let refreshToken = null;
let refreshHandler = null;

export const setAuthTokens = (access, refresh) => {
  accessToken = access;
  refreshToken = refresh;
};

export const clearAuthTokens = () => {
  accessToken = null;
  refreshToken = null;
};

export const setRefreshHandler = (handler) => {
  refreshHandler = handler;
};

api.interceptors.request.use((config) => {
  const cfg = { ...config };
  if (accessToken) {
    cfg.headers.Authorization = `Bearer ${accessToken}`;
  }
  return cfg;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      refreshToken &&
      refreshHandler
    ) {
      try {
        const newAccess = await refreshHandler();
        if (newAccess) {
          const retryConfig = { ...error.config };
          retryConfig.headers.Authorization = `Bearer ${newAccess}`;
          return api.request(retryConfig);
        }
      } catch (refreshError) {
        // fall through to reject
      }
    }
    return Promise.reject(error);
  }
);

export default api;

