import { http } from './http'
import { useAuthStore } from '../auth/useAuthStore'

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    if (status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(err)
  },
)
