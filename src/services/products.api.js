import { apiRequest } from './api';

let cachedProducts = null;
let cacheTime = null;
const CACHE_DURATION = 120000; // 2 minutes

// Fetch active products (Public API) with client-side caching
export async function getActiveProducts(force = false) {
  if (cachedProducts && !force && (Date.now() - cacheTime < CACHE_DURATION)) {
    return cachedProducts;
  }
  
  const res = await apiRequest('/products');
  if (res.success) {
    cachedProducts = res.data;
    cacheTime = Date.now();
    return cachedProducts;
  }
  throw new Error(res.message || 'Failed to fetch active products');
}

// Fetch single product details (Public API)
export async function getProductById(id) {
  const res = await apiRequest(`/products/${id}`);
  if (res.success) {
    return res.data;
  }
  throw new Error(res.message || 'Failed to fetch product details');
}

// Fetch all products for admin management (requires admin auth)
export async function getAdminProducts() {
  const res = await apiRequest('/products?admin=true');
  if (res.success) {
    return res.data;
  }
  throw new Error(res.message || 'Failed to fetch admin products inventory');
}
