const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL !== undefined) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (import.meta.env.PROD) {
    return '';
  }
  if (typeof window !== 'undefined' && window.location.hostname) {
    return `http://${window.location.hostname}:5001`;
  }
  return 'http://localhost:5001';
};

export const API_BASE_URL = getApiBaseUrl();

