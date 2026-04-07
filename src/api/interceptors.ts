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
  toast({
    title: title,
    description: description,
    duration: 3000,
    variant: 'destructive',
  });
};

const getReadableError = (error: any) => {
  const status = error.response?.status;
  const data = error.response?.data;
  const rawMessage = String(data?.message || '');

  let title = 'خطأ';
  let description = 'حدث خطأ غير متوقع';

  // 1. Handle Validation Errors (422)
  if (status === 422) {
    title = 'بيانات غير صحيحة';
    if (data?.errors) {
      for (const key of ['sku', 'barcode'] as const) {
        const list = data.errors[key];
        const first = Array.isArray(list) ? list[0] : '';
        if (!first) continue;
        const s = String(first);
        const low = s.toLowerCase();
        if (
          /مستخدم|مكرر|موجود|مسجل|تسجيل|بالفعل/i.test(s) ||
          low.includes('taken') ||
          low.includes('unique') ||
          low.includes('already') ||
          low.includes('exists') ||
          low.includes('duplicate')
        ) {
          title = 'تنبيه';
          description =
            'الباركود مستخدم بالفعل لمنتج آخر، يرجى تغييره.';
          return { title, description };
        }
      }
      // Get the first error message from the errors object
      const firstErrorKey = Object.keys(data.errors)[0];
      const firstError = data.errors[firstErrorKey]?.[0];
      description = String(firstError || 'يرجى التحقق من البيانات المدخلة');
    } else {
      description = rawMessage || 'يرجى التحقق من البيانات المدخلة';
    }
    return { title, description };
  }

  // 2. Handle Permissions (403)
  if (status === 403) {
    return {
      title: 'صلاحيات غير كافية',
      description: 'ليس لديك الصلاحية للقيام بهذا الإجراء.',
    };
  }

  // 3. Handle Server Errors (500) or SQL Errors wrapped in other statuses
  if (status === 500 || rawMessage.includes('SQLSTATE')) {
    title = 'خطأ في النظام';

    // Duplicate Entry
    if (rawMessage.includes('Duplicate entry')) {
      title = 'بيانات مكررة';
      if (rawMessage.includes('sku') || rawMessage.includes('barcode')) {
        description = 'الباركود مستخدم بالفعل لمنتج آخر، يرجى تغييره.';
      } else if (rawMessage.includes('email')) {
        description = 'البريد الإلكتروني مستخدم بالفعل.';
      } else if (rawMessage.includes('phone') || rawMessage.includes('mobile')) {
        description = 'رقم الهاتف مستخدم بالفعل.';
      } else {
        description = 'هذه القيمة مسجلة مسبقاً في النظام.';
      }
      return { title, description };
    }

    // Foreign Key Constraint (Cannot delete/update parent row)
    if (
      rawMessage.includes('Integrity constraint violation') &&
      rawMessage.includes('foreign key constraint')
    ) {
      title = 'عملية غير مسموحة';
      description =
        'لا يمكن حذف أو تعديل هذا العنصر لأنه مرتبط ببيانات أخرى في النظام.';
      return { title, description };
    }

    // General SQL Error
    if (rawMessage.includes('SQLSTATE')) {
      description = 'حدث خطأ في قاعدة البيانات، يرجى المحاولة لاحقاً.';
      return { title, description };
    }

    // General 500
    description = 'حدث خطأ فني في الخادم، يرجى المحاولة لاحقاً.';
    return { title, description };
  }

  // Default fallback for other errors
  return {
    title: 'تنبيه',
    description: rawMessage || `Error: ${status}`,
  };
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isVerifyPin = config.url?.includes('verify-pin');
    const isPosOrderCreate = config.method === 'post' && config.url?.includes('orders');
    const skipGlobalLoading = isVerifyPin || isPosOrderCreate;
    if (!skipGlobalLoading) {
      setGlobalLoading(true);
    }
    (config as InternalAxiosRequestConfig & { skipGlobalLoading?: boolean }).skipGlobalLoading = skipGlobalLoading;

    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = 'application/json';

    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const reportRoutes = [
      '/zood-dashboard/normal-report',
      '/zood-dashboard/b2b-report',
      '/zood-dashboard/purchase-report',
      '/zood-dashboard/items-report',
      '/zood-dashboard/payment-report',
    ];
    const currentPath = window.location.pathname;
    const isReportRoute = reportRoutes.includes(currentPath);
    const isAllBranchesReports =
      Cookies.get('report_all_branches') === '1' && isReportRoute;

    const branchId = Cookies.get('branch_id');
    if (!isAllBranchesReports && branchId && config.method === 'get') {
      config.params = { ...config.params, 'filter[branch_id]': branchId };
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
    const skipLoading = (response.config as { skipGlobalLoading?: boolean }).skipGlobalLoading;
    if (!skipLoading) setGlobalLoading(false);
    return response;
  },
  (error) => {
    const skipLoading = (error.config as { skipGlobalLoading?: boolean })?.skipGlobalLoading;
    if (!skipLoading) setGlobalLoading(false);

    if (error.response?.status === 401) {
      const backendMessage = error.response?.data?.message || '';
      const message = backendMessage || 'Unauthorized access - token expired.';
      if (!window.location.pathname.includes('/zood-login')) {
        showToast('خطأ في المصادقة', message);
      }
      removeToken();
      if (!window.location.pathname.includes('/zood-login')) {
        window.location.href = '/zood-login';
      }
    } else {
      // remove all 404 errors like (customer not found - rout not found - etc)
      // skip toast for verify-pin - handled by PinLoginScreen
      const isVerifyPin = (error.config?.url as string)?.includes('verify-pin');
      const skipGlobalErrorToast = Boolean(
        (error.config as { skipGlobalErrorToast?: boolean })?.skipGlobalErrorToast
      );
      if (
        error.response?.status !== 404 &&
        !isVerifyPin &&
        !skipGlobalErrorToast
      ) {
        const { title, description } = getReadableError(error);
        showToast(title, description);
      }
      // window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
