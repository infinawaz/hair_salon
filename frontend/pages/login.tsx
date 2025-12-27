import { useForm } from 'react-hook-form'
import api, { setAuthToken } from '../lib/api'
import { useRouter } from 'next/router'
import { useAuthStore } from '../stores/authStore'
import Layout from '../components/Layout'

type FormData = {
  username: string
  password: string
}

export default function Login() {
  const { register, handleSubmit } = useForm<FormData>()
  const router = useRouter()
  const setToken = useAuthStore((s) => s.setToken)

  const setTokens = useAuthStore((s) => s.setTokens)

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/token/', { username: data.username, password: data.password })
      const access = res.data.access
      const refresh = res.data.refresh
      // persist tokens in store and localStorage
      setTokens(access, refresh)
      // set axios header
      setAuthToken(access)
      router.push('/')
    } catch (err) {
      alert('Login failed')
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm">Username</label>
            <input className="w-full border p-2 rounded" {...register('username')} />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input type="password" className="w-full border p-2 rounded" {...register('password')} />
          </div>
          <div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
