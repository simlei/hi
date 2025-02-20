import Link from 'next/link';

export default function CV() {
  return (
    <div className="min-h-screen bg-primary-50">
      <header className="bg-primary-100 py-4">
        <div className="container mx-auto px-4">
          <Link 
            href="/"
            className="text-accent-600 hover:text-accent-700"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-4">
            Curriculum Vitae
          </h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">Experience</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-primary-700">Software Engineer - Spleenlab GmbH</h3>
                <p className="text-primary-500">May 2023 - Present</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-700">Software Engineer - Esslinger IT Consulting</h3>
                <p className="text-primary-500">August 2019 - December 2022</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project placeholder - to be populated */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <div className="w-full h-32 bg-primary-200 rounded-md mb-4"></div>
                <h3 className="text-lg font-medium text-primary-700">Project Title</h3>
                <p className="text-primary-500">Brief project description</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}