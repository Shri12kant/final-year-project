import { safeGetItem, safeRemoveItem, safeSetItem } from '../lib/safeStorage'

const ACCESS_TOKEN_KEY = 'ch_access_token'

export const tokenStorage = {
  getAccessToken(): string | null {
    return safeGetItem(ACCESS_TOKEN_KEY)
  },
  setAccessToken(token: string) {
    safeSetItem(ACCESS_TOKEN_KEY, token)
  },
  clear() {
    safeRemoveItem(ACCESS_TOKEN_KEY)
  },
}

