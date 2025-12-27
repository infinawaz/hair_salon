import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../lib/api'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Protected from '../../components/Protected'

type FormData = {
  customer: number
  staff?: number
  service: number
  start_datetime: string
}

export default function NewAppointment() {
  const { register, handleSubmit } = useForm<FormData>()
  const router = useRouter()
  const [services, setServices] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [staff, setStaff] = useState<any[]>([])

  useEffect(() => {
    api.get('/services/').then((r) => setServices(r.data))
    api.get('/customers/').then((r) => setCustomers(r.data))
    api.get('/staff/').then((r) => setStaff(r.data))
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/appointments/', data)
      router.push('/appointments')
    } catch (err) {
      alert('Failed to create appointment')
    }
  }

  return (
    <Protected>
      <Layout>
        <div className="max-w-lg">
          <h1 className="text-2xl font-bold mb-4">New Appointment</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 bg-white p-4 rounded shadow">
          <div>
            <label className="block text-sm">Customer</label>
            <select className="w-full border p-2 rounded" {...register('customer')}> 
              <option value="">Select</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm">Service</label>
            <select className="w-full border p-2 rounded" {...register('service')}> 
              <option value="">Select</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm">Staff (optional)</label>
            <select className="w-full border p-2 rounded" {...register('staff')}> 
              <option value="">Any</option>
              {staff.map(s => <option key={s.id} value={s.id}>{s.user}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm">Start (ISO format)</label>
            <input className="w-full border p-2 rounded" {...register('start_datetime')} placeholder="2025-11-15T14:00:00Z" />
          </div>
          <div>
            <button className="bg-green-600 text-white px-4 py-2 rounded">Book</button>
          </div>
          </form>
        </div>
      </Layout>
    </Protected>
  )
}
