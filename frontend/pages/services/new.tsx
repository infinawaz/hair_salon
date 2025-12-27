import React from 'react'
import Layout from '../../components/Layout'
import ServiceForm from '../../components/ServiceForm'
import Protected from '../../components/Protected'

export default function NewService() {
  return (
    <Protected>
      <Layout>
        <div className="max-w-lg">
          <h1 className="text-2xl font-bold mb-4">New Service</h1>
          <ServiceForm />
        </div>
      </Layout>
    </Protected>
  )
}
