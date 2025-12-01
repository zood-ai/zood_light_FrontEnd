import { useContext, useState, createContext, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

interface AuthContextType {
  user: string | null;
  login: (
    data: LoginData
  ) => Promise<{ success: boolean; error: boolean; errorCode?: number }>;
  logout: () => void;
}

interface LoginData {
  email: string;
  business_reference: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const showToast = (title: string, description: string) => {
  toast({
    title,
    description,
    duration: 3000,
    variant: 'destructive',
  });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(
    Cookies.get('accessToken') || null
  );

  const login = async (
    data: LoginData
  ): Promise<{ success: boolean; error: boolean; errorCode?: number }> => {
    const newBaseUrl = localStorage.getItem(
      'd14758f1afd44c09b7992073ccf00b43d'
    );
    const apiUrl = `${newBaseUrl ? newBaseUrl : baseURL}auth/Login`;

    try {
      const { data: responseData } = await axios.post(apiUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const token = responseData?.data?.token;
      const name = responseData?.data?.user?.name;
      const business = {
        businessName: responseData?.data?.user.businessName,
        businessBusinessRef: responseData?.data?.user.business_reference,
      };
      const userId = responseData?.data?.user?.id;
      if (token) {
        Cookies.set('accessToken', token, { expires: 1, path: '/' });
        Cookies.set('refreshToken', token, { expires: 1, path: '/' });
        Cookies.set('name', name, { expires: 1, path: '/' });
        Cookies.set('userId', userId, { expires: 1 });
        Cookies.set('business', JSON.stringify(business), { expires: 1 });
        setUser(token);
        return { success: true, error: false };
      }

      showToast('Login Error', 'Invalid token received');
      return { error: true, success: false };
    } catch (error: any) {
      console.error('Login failed', error);
      const errorMessage =
        error.response?.data?.message || 'An unexpected error occurred';
      const errorCode = error.response?.status || 'Unknown';
      if (errorCode !== 401)
        showToast(errorMessage, `Error: ${errorCode} - ${errorMessage}`);
      return { error: true, success: false, errorCode };
    }
  };

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('name');
    Cookies.remove('userId');
    Cookies.remove('branch_id');
    setUser(null);
    window.location.href = '/zood-login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to safely access the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
