import { create } from 'zustand'
import { authApi } from '../api/authApi'
import { tokenStorage } from './tokenStorage'
import type { AuthTokens, AuthUser } from './types'

type AuthState = {
  user: AuthUser | null
  tokens: AuthTokens | null
  hydrated: boolean
  setSession: (input: { user: AuthUser; tokens: AuthTokens }) => void
  logout: () => void
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: tokenStorage.getAccessToken()
    ? { accessToken: tokenStorage.getAccessToken()! }
    : null,
  hydrated: !tokenStorage.getAccessToken(),
  setSession: ({ user, tokens }) => {
    tokenStorage.setAccessToken(tokens.accessToken)
    set({ user, tokens, hydrated: true })
  },
  logout: () => {
    tokenStorage.clear()
    set({ user: null, tokens: null, hydrated: true })
  },
  hydrate: async () => {
    const token = tokenStorage.getAccessToken()
    if (!token) {
      set({ hydrated: true })
      return
    }

    try {
      const user = await authApi.me()
      set({ user, tokens: { accessToken: token }, hydrated: true })
    } catch {
      tokenStorage.clear()
      set({ user: null, tokens: null, hydrated: true })
    }
  },
}))

