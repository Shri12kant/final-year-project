const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8084'

export function toMediaUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) return null
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl
  if (pathOrUrl.startsWith('/')) return `${API_BASE}${pathOrUrl}`
  return `${API_BASE}/${pathOrUrl}`
}
