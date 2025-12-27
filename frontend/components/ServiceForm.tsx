import { useForm } from 'react-hook-form'
import api from '../lib/api'
import { useRouter } from 'next/router'

type FormData = {
  name: string
  price: string
  duration_minutes: number
}

export default function ServiceForm() {
  const { register, handleSubmit } = useForm<FormData>()
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/services/', data)
      router.push('/services')
    } catch (err) {
      alert('Failed to create service')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 bg-white p-4 rounded shadow">
      <div>
        <label className="block text-sm">Name</label>
        <input className="w-full border p-2 rounded" {...register('name')} />
      </div>
      <div>
        <label className="block text-sm">Price</label>
        <input className="w-full border p-2 rounded" {...register('price')} />
      </div>
      <div>
        <label className="block text-sm">Duration (minutes)</label>
        <input type="number" className="w-full border p-2 rounded" {...register('duration_minutes')} />
      </div>
      <div>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
      </div>
    </form>
  )
}
