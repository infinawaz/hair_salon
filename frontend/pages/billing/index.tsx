import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../lib/api'
import Link from 'next/link'
import Protected from '../../components/Protected'

type Bill = {
  id: number
  customer: string
  total: string
}

export default function BillingPage() {
  const [bills, setBills] = useState<Bill[]>([])

  useEffect(() => {
    api.get('/bills/').then((res) => setBills(res.data))
  }, [])

  return (
    <Protected>
      <Layout>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Billing</h1>
        </div>
        <div className="bg-white rounded shadow">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left p-3">Invoice</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="p-3"><Link href={`/billing/${b.id}`}><a>#{b.id}</a></Link></td>
                  <td className="p-3">{b.customer}</td>
                  <td className="p-3">{b.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </Protected>
  )
}
