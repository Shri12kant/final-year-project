import axios from 'axios'
import { tokenStorage } from '../auth/tokenStorage'

export const http = axios.create({
  // ✅ Fixed - api/ हटाया
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://final-year-project-production-666e.up.railway.app',
})
http.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})