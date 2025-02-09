import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  headers: {
    "Content-Type": "application/json", // Default for JSON
  },
  params: "",
});

// Response interceptor to handle errors and responses
axiosInstance.interceptors.response.use(
  function (response) {
    if (response.data.message && response.config.method !== "get") {
      // toast.success(response.data.message);
    }
    return response;
  },
  function (error) {
    if (error.response?.status === 401) {
      // toast.error("Your token has expired, please login again");
      window.location.href = "/login";
      Cookies.remove("token");
    } else {
      // toast.error(error?.response.data?.message);
    }
    return Promise.reject(error.response);
  }
);

// Request interceptor to handle token and dynamic Content-Type
axiosInstance.interceptors.request.use(async (config) => {
  const token = Cookies.get("token");

  // If the request data is a FormData instance, set Content-Type to 'multipart/form-data'
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }

  // Attach token if available
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
