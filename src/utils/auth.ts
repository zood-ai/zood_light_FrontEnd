import Cookies from 'js-cookie';

export const getToken = (): string | undefined => {
    const token = Cookies.get('accessToken');
    return token ? String(token).trim() : undefined;
  };

  export const removeToken = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('authorities');
    Cookies.remove('branch_id');
  };
  