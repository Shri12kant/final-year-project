const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8084'

export function toMediaUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) return null
  // Cloudinary URLs are already absolute (https://res.cloudinary.com/...)
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl
  // Legacy local storage support (for old posts)
  if (pathOrUrl.startsWith('/')) return `${API_BASE}${pathOrUrl}`
  return `${API_BASE}/${pathOrUrl}`
}
