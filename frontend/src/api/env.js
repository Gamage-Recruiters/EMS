const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "/api";

export const API_BASE_URL = rawApiUrl;

export const BACKEND_BASE_URL = (() => {
  try {
    const resolved = new URL(rawApiUrl, window.location.origin).toString();
    return resolved.replace(/\/api\/?$/, "");
  } catch {
    return rawApiUrl.replace(/\/api\/?$/, "") || window.location.origin;
  }
})();

export function getBackendUploadUrl(imagePath) {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
    return imagePath;
  }

  return `${BACKEND_BASE_URL}/uploads/${imagePath}`;
}
