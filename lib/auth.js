import Cookies from 'js-cookie';

export const API_BASE = '/api';

export const setAuthToken = (token) => {
  Cookies.set('token', token, { expires: 7 });
};

export const getAuthToken = () => {
  return Cookies.get('token');
};

export const removeAuthToken = () => {
  Cookies.remove('token');
};

export const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
};