import type { AuthUser } from '../auth/types'

export type AuthResponseDto = {
  accessToken: string
  user: AuthUser
}
