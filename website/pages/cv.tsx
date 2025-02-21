import { GraphBackground } from '../components/GraphBackground';
import Image from 'next/image';

import { Layout } from '../components/Layout';

export default function CV() {
  return (
    <Layout title="John Doe - CV">
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <GraphBackground />
      
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        {/* Header with Portrait */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg">
            <Image
              src="/images/portraits/portrait.png"
              alt="Professional Portrait"
              width={192}
              height={192}
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">John Doe</h1>
            <h2 className="text-xl text-gray-600 mt-2">Senior Software Engineer</h2>
            <p className="text-gray-600 mt-4 max-w-xl">
              Experienced software engineer with a passion for building scalable systems
              and solving complex problems. Specializing in distributed systems and
              cloud architecture.
            </p>
          </div>
        </div>

        {/* Experience Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Experience</h2>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Senior Software Engineer</h3>
                  <p className="text-gray-600">2020 - Present</p>
                </div>
                <div className="h-12 w-32 relative">
                  <Image
                    src="/images/companies/techcorp.png"
                    alt="TechCorp Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Led development of cloud-native applications</li>
                <li>Implemented microservices architecture</li>
                <li>Mentored junior developers</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Software Engineer</h3>
                  <p className="text-gray-600">2018 - 2020</p>
                </div>
                <div className="h-12 w-32 relative">
                  <Image
                    src="/images/companies/devsys.png"
                    alt="DevSys Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Developed full-stack web applications</li>
                <li>Optimized database performance</li>
                <li>Implemented CI/CD pipelines</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Skills</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Languages & Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {['JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'Next.js'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Tools & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {['Docker', 'Kubernetes', 'AWS', 'Git', 'CI/CD', 'MongoDB'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Master of Computer Science</h3>
            <p className="text-gray-600">University of Technology, 2018</p>
            <p className="text-gray-600 mt-2">
              Focus on Distributed Systems and Machine Learning
            </p>
          </div>
        </section>
      </div>
    </div>
    </Layout>
  );
}