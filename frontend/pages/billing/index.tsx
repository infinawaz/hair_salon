import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../lib/api'
import Protected from '../../components/Protected'
import Modal from '../../components/Modal'

type Bill = {
  id: number
  customer: string
  total: string
}

export default function BillingPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [selectedBillId, setSelectedBillId] = useState<number | null>(null)
  const [invoiceHtml, setInvoiceHtml] = useState<string | null>(null)

  useEffect(() => {
    api.get('/bills/').then((res) => setBills(res.data))
  }, [])

  const handleOpenInvoice = async (id: number) => {
    setSelectedBillId(id)
    try {
      const res = await api.get(`/bills/${id}/invoice/`)
      setInvoiceHtml(res.data.html)
    } catch (err) {
      console.error(err)
      setInvoiceHtml('<p>Failed to load invoice.</p>')
    }
  }

  const handleCloseModal = () => {
    setSelectedBillId(null)
    setInvoiceHtml(null)
  }

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
                <tr key={b.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <button
                      onClick={() => handleOpenInvoice(b.id)}
                      className="text-blue-600 hover:underline font-bold"
                    >
                      #{b.id}
                    </button>
                  </td>
                  <td className="p-3">{b.customer}</td>
                  <td className="p-3">{b.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={!!selectedBillId}
          onClose={handleCloseModal}
          title={`Invoice #${selectedBillId}`}
        >
          {invoiceHtml ? (
            <div dangerouslySetInnerHTML={{ __html: invoiceHtml }} />
          ) : (
            <div className="flex justify-center p-4">Loading invoice...</div>
          )}
        </Modal>
      </Layout>
    </Protected>
  )
}
