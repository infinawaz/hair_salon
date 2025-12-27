import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'

export default function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const token = useAuthStore((s) => s.token)

  useEffect(() => {
    if (!token) router.replace('/login')
  }, [token])

  if (!token) return null
  return <>{children}</>
}
