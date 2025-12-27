import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { setAuthToken as setAuthTokenLocal } from '../stores/authHelpers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// attach access token if available
export function setAuthToken(token: string | null) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete api.defaults.headers.common['Authorization']
}

// Response interceptor to handle 401 and attempt token refresh
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (err.response && err.response.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh')
        if (!refresh) throw err
        const r = await axios.post(`${API_URL}/token/refresh/`, { refresh })
        const access = r.data.access
        // persist and set header
        localStorage.setItem('token', access)
        setAuthTokenLocal(access)
        setAuthToken(access)
        original.headers = original.headers || {}
        original.headers['Authorization'] = `Bearer ${access}`
        return api(original)
      } catch (e) {
        // refresh failed, remove tokens
        localStorage.removeItem('token')
        localStorage.removeItem('refresh')
        setAuthToken(null)
        return Promise.reject(e)
      }
    }
    return Promise.reject(err)
  }
)

export default api
