/**
 * Computes full backend URL for static files (e.g., uploaded complaint images).
 * @param {string} imagePath - Relative path like "/uploads/xyz.jpg" or full URL
 * @returns {string} Fully resolved image URL
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
  if (!rawBaseUrl) {
    return imagePath;
  }

  // Remove trailing /api or trailing slash from base URL
  const backendOrigin = rawBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  return `${backendOrigin}${cleanPath}`;
}
