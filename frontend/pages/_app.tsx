import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { setAuthToken } from '../lib/api'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // hydrate token from localStorage on client
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (t) setAuthToken(t)
  }, [])

  return <Component {...pageProps} />
}
