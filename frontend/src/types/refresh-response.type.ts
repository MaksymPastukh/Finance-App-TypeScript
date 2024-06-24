export type RefreshResponseType = {
  error?: boolean,
  tokens: RefreshTrue,
  message?: string,
}

export type RefreshTrue = {
  accessToken: string,
  refreshToken: string,
}

