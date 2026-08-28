export const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL ||
    (import.meta.env.DEV ? 'http://localhost:3000' : '');

export const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('auth_token');
    const fullUrl = `${BACKEND_URL}${url}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
  
    const response = await fetch(fullUrl, { ...options, headers });
    
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Token expired or invalid - redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/sign-in';
      }
      throw new Error('Request failed');
    }
    
    return response.json();
  };
