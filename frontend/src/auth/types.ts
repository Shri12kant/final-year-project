export type AuthUser = {
  id: number
  username: string
  email: string
  roles?: string[]
}

export type AuthTokens = {
  accessToken: string
}

