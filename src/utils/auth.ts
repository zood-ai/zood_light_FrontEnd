import Cookies from 'js-cookie';

export const getToken = (): string | any => {
    return Cookies.get('accessToken');
  };
  

  export const removeToken = () => {
    return Cookies.remove('accessToken');
  };
  