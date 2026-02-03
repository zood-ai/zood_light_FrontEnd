import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { toast } from '@/components/ui/use-toast';
import { setGlobalLoading } from '@/context/LoadingContext';
import { getToken, removeToken } from '@/utils/auth';
import Cookies from 'js-cookie';

const newBaseUrl = localStorage.getItem('d14758f1afd44c09b7992073ccf00b43d');
const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: newBaseUrl ? newBaseUrl : baseURL,
});

// Helper function to display toast
const showToast = (title: string, description: string) => {
  // ({description})
  toast({
    title: title,
    description: description,
    duration: 3000,
    variant: 'destructive',
  });
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // if (config.method === 'get') {
    setGlobalLoading(true);
    // }

    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = 'application/json';

    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const branchId = Cookies.get('branch_id');
    if (branchId && config.method !== 'get') {
      if (config.data && typeof config.data === 'object') {
        config.data = { ...config.data, branch_id: branchId };
      }
    }
    if (branchId && config.method === 'get') {
      config.params = { ...config.params, branch_id: branchId };
    }

    return config;
  },
  (error: AxiosError) => {
    setGlobalLoading(false);
    showToast('Error', 'An error occurred while making the request.');
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    setGlobalLoading(false);
    return response;
  },
  (error) => {
    setGlobalLoading(false);

    if (error.response?.status === 401) {
      showToast('Error', 'Unauthorized access - token expired.');
      removeToken();
      window.location.href = '/';
    } else {
      // remove all 404 errors like (customer not found - rout not found - etc)
      if (error.response?.status !== 404) {
        showToast(
          error.response?.data?.message,
          `Error: ${error.response?.status} - ${error.response?.data?.message}`
        );
      }
      // window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
