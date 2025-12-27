import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../lib/api'
import Protected from '../../components/Protected'

type Customer = {
  id: number
  first_name: string
  last_name: string
  email?: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    api.get('/customers/').then((res) => setCustomers(res.data))
  }, [])

  return (
    <Protected>
      <Layout>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Customers</h1>
        </div>
        <div className="bg-white rounded shadow">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.first_name} {c.last_name}</td>
                  <td className="p-3">{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </Protected>
  )
}
