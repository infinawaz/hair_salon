import create from 'zustand'

type AuthState = {
  token: string | null
  refresh: string | null
  setTokens: (access: string | null, refresh: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? (localStorage.getItem('token') || null) : null,
  refresh: typeof window !== 'undefined' ? (localStorage.getItem('refresh') || null) : null,
  setTokens: (access, refresh) => {
    if (typeof window !== 'undefined') {
      if (access) localStorage.setItem('token', access)
      else localStorage.removeItem('token')
      if (refresh) localStorage.setItem('refresh', refresh)
      else localStorage.removeItem('refresh')
    }
    set({ token: access, refresh })
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('refresh')
    }
    set({ token: null, refresh: null })
  },
}))
