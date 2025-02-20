import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-primary-50">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">
            Welcome
          </h1>
          <p className="text-primary-600 mb-8">
            Software Engineer | Problem Solver | Open Source Enthusiast
          </p>
          <div className="space-y-4">
            <Link 
              href="/cv"
              className="inline-block bg-accent-600 text-white px-6 py-2 rounded-lg hover:bg-accent-700 transition-colors"
            >
              View CV
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="fixed bottom-0 w-full bg-primary-100 py-4">
        <div className="container mx-auto px-4 text-center text-primary-600">
          <p>Contact: openhands@all-hands.dev</p>
        </div>
      </footer>
    </div>
  );
}