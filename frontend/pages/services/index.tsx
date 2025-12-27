import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../lib/api'
import Link from 'next/link'

type Service = {
  id: number
  name: string
  price: string
  duration_minutes: number
}

import Protected from '../../components/Protected'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    api.get('/services/').then((res) => setServices(res.data))
  }, [])

  return (
    <Protected>
      <Layout>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Services</h1>
          <Link href="/services/new"><a className="bg-blue-600 text-white px-3 py-1 rounded">Add</a></Link>
        </div>
        <div className="bg-white rounded shadow">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Duration</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.price}</td>
                  <td className="p-3">{s.duration_minutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </Protected>
  )
}
