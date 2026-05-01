const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8084'

export function toMediaUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) return null
  
  // Cloudinary URLs are already absolute (https://res.cloudinary.com/...)
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    // Check if it's a valid Cloudinary URL
    if (pathOrUrl.includes('cloudinary.com')) {
      return pathOrUrl
    }
    // Not a Cloudinary URL, might be invalid
    return null
  }
  
  // Legacy local storage support (for old posts)
  if (pathOrUrl.startsWith('/')) return `${API_BASE}${pathOrUrl}`
  
  // Legacy UUID filenames (local storage) - these won't work anymore
  // Return null so the UI shows error state instead of broken image
  if (pathOrUrl.match(/^[a-f0-9-]+\.jpg$/i) || pathOrUrl.match(/^[a-f0-9-]+\.png$/i)) {
    return null
  }
  
  return `${API_BASE}/${pathOrUrl}`
}
