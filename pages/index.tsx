import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Simon Leischnig</h1>
        <p className="text-lg mb-8">Software Developer & Systems Engineer</p>
        <div className="space-y-4">
          <Link 
            href="/cv"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            View CV
          </Link>
        </div>
      </div>
    </main>
  )
}