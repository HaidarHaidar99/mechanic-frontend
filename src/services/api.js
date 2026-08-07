const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://mechanic-backend-sigma.vercel.app';
export const API_BASE_URL = `${BACKEND_URL}/api`;

export const getAuthHeader = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper for generic API requests
export async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  // Safe parse JSON
  let json;
  try {
    json = await response.json();
  } catch (e) {
    throw new Error('Failed to parse server response');
  }

  if (!response.ok) {
    throw new Error(json.message || `Request failed with status ${response.status}`);
  }

  return json;
}
