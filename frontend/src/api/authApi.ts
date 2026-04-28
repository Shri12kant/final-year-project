import { http } from './http'
import type { AuthResponseDto } from '../types/auth'

export const authApi = {
  register: async (input: { username: string; email: string; password: string }) => {
    const res = await http.post<AuthResponseDto>('/api/auth/register', input)
    return res.data
  },

  login: async (input: { email: string; password: string }) => {
    const res = await http.post<AuthResponseDto>('/api/auth/login', input)
    return res.data
  },

  me: async () => {
    const res = await http.get<AuthResponseDto['user']>('/api/auth/me')
    return res.data
  },
}
