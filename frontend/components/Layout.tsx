import React from 'react'
import Nav from './Nav'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="container py-8 flex-1">{children}</main>
      <footer className="border-t py-4 text-center text-sm text-gray-500">© Salon</footer>
    </div>
  )
}
