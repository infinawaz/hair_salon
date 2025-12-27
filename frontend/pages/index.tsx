export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold">Salon Dashboard (Frontend scaffold)</h1>
        <p className="mt-4 text-gray-600">Connects to backend API at <code>process.env.NEXT_PUBLIC_API_URL</code></p>
      </div>
    </main>
  )
}
