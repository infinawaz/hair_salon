// small helpers for auth token persistence used by api wrapper
export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}

export function setRefreshToken(refresh: string | null) {
  if (refresh) localStorage.setItem('refresh', refresh)
  else localStorage.removeItem('refresh')
}
