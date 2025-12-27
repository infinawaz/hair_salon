import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuthStore } from '../stores/authStore'
import { setAuthToken } from '../lib/api'

export default function Nav() {
  const router = useRouter()
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)

  const doLogout = () => {
    logout()
    setAuthToken(null)
    // also clear refresh token from storage
    try { localStorage.removeItem('refresh') } catch (e) {}
    router.push('/login')
  }

  return (
    <nav className="bg-white border-b">
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center gap-4">
          <Link href="/">
            <a className="font-bold">Salon</a>
          </Link>
          <Link href="/services">
            <a>Services</a>
          </Link>
          <Link href="/customers">
            <a>Customers</a>
          </Link>
          <Link href="/appointments">
            <a>Appointments</a>
          </Link>
          <Link href="/billing">
            <a>Billing</a>
          </Link>
          <Link href="/reports">
            <a>Reports</a>
          </Link>
        </div>
        <div>
          {token ? (
            <button onClick={doLogout} className="text-sm text-red-600">Logout</button>
          ) : (
            <Link href="/login"><a className="text-sm">Login</a></Link>
          )}
        </div>
      </div>
    </nav>
  )
}
