import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../lib/api'
import { useRouter } from 'next/router'
import Protected from '../../components/Protected'

export default function InvoicePage() {
  const router = useRouter()
  const { id } = router.query
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    api.get(`/bills/${id}/invoice/`).then((res) => setHtml(res.data.html))
  }, [id])

  return (
    <Protected>
      <Layout>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Invoice #{id}</h1>
          {html ? (
            <div className="bg-white p-4 rounded shadow" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </Layout>
    </Protected>
  )
}
