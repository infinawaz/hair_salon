import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../lib/api'
import Link from 'next/link'
import Protected from '../../components/Protected'

type Appointment = {
  id: number
  service: { name: string }
  customer: { first_name: string, last_name: string }
  start_datetime: string
  status: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    api.get('/appointments/').then((res) => setAppointments(res.data))
  }, [])

  return (
    <Protected>
      <Layout>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Appointments</h1>
          <Link href="/appointments/new"><a className="bg-blue-600 text-white px-3 py-1 rounded">New</a></Link>
        </div>
        <div className="bg-white rounded shadow">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left p-3">Service</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Start</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-3">{a.service?.name}</td>
                  <td className="p-3">{a.customer?.first_name} {a.customer?.last_name}</td>
                  <td className="p-3">{a.start_datetime}</td>
                  <td className="p-3">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </Protected>
  )
}
