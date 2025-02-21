import { GoldenGraph } from '../components/GoldenGraph';
import { Layout } from '../components/Layout';
import { ProjectCard } from '../components/ProjectCard';

export default function CV() {
  return (
    <Layout title="Simon Leischnig - CV">
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50">
      <GoldenGraph />
      
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-primary-100">
          <h1 className="text-3xl font-bold text-primary-900">Simon Leischnig</h1>
          <p className="text-lg text-primary-700">Software and Algorithms Engineer</p>
          <div className="mt-4 text-primary-700/90 space-y-1">
            <p>Address: Am Teich 8, 07743 Jena, Germany</p>
            <p>Phone: 01590 / 5077 303</p>
            <p>Email: simon.leischnig@stud.tu-darmstadt.de</p>
            <p>GitHub: <a href="http://github.com/simlei" className="text-accent-700 hover:text-accent-800 transition-colors">@simlei</a></p>
            <p>Website: <a href="http://simlei.github.io/hi" className="text-accent-700 hover:text-accent-800 transition-colors">simlei.github.io/hi</a></p>
          </div>
        </div>

        {/* Work Experience Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-800 mb-6 flex items-center">
            <span className="bg-gradient-to-r from-primary-100/80 to-accent-50/50 px-6 py-3 rounded-lg shadow-sm">
              Professional Experience
            </span>
          </h2>
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-primary-800">Software and Algorithms Engineer - Spleenlab GmbH</h3>
              <p className="text-primary-600">May 2023 - Present</p>
              <p className="text-primary-700">Developing algorithms for autonomous systems and robotics, one standalone product and one successful complex algorithm transcription to C99 and complete coverage with tests</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-primary-800">Project Lead - Esslinger IT Consulting</h3>
              <p className="text-primary-600">2020 - 2023</p>
              <p className="text-primary-700">JCrypTool project lead, core development and dev-ops responsibilities</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-primary-800">Software Developer - Cynops GmbH</h3>
              <p className="text-primary-600">2009 - 2015</p>
              <p className="text-primary-700">Cryptography and Security solutions development</p>
            </div>
          </div>
        </section>

        {/* Publications Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-800 mb-6 flex items-center">
            <span className="bg-gradient-to-r from-primary-100/80 to-accent-50/50 px-6 py-3 rounded-lg shadow-sm">
              Publications
            </span>
          </h2>
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-primary-700">A Kernel-based Approach to Learning Contact Distributions for Robot Manipulation Tasks</h3>
              <p className="text-primary-600">Kroemer, O.; Leischnig, S.; Luettgen, S.; Peters, J.</p>
              <p className="text-primary-500">Autonomous Robots (AuRo), 2017</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-primary-700">A Comparison of Contact Distribution Representations for Learning to Predict Object Interactions</h3>
              <p className="text-primary-600">Leischnig, S.; Luettgen, S.; Kroemer, O.; Peters, J.</p>
              <p className="text-primary-500">IEEE-RAS International Conference on Humanoid Robots (Humanoids), 2015</p>
            </div>
          </div>
        </section>

        {/* Technical Skills Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-800 mb-6 flex items-center">
            <span className="bg-gradient-to-r from-primary-100/80 to-accent-50/50 px-6 py-3 rounded-lg shadow-sm">
              Technical Skills
            </span>
          </h2>
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50">
              <h3 className="text-lg font-medium text-primary-800 mb-3">Highly Proficient</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'C++',
                  'Scala 2/3',
                  'Bash',
                  'Python',
                  'Maven',
                  'Java',
                  'Build Tools',
                  'DevOps',
                  'Linux',
                  'Automation',
                  'Interface Design',
                  'Software Design',
                  'Planning'
                ].map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-accent-100 text-accent-900 rounded-full text-sm font-medium transform hover:scale-105 transition-transform duration-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50">
              <h3 className="text-lg font-medium text-primary-800 mb-3">Adept</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Git',
                  'Docker',
                  'CI/CD',
                  'TypeScript',
                  'React',
                  'Next.js',
                  'GUI Frameworks'
                ].map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-accent-50/80 text-accent-800 rounded-full text-sm transform hover:scale-105 transition-transform duration-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50">
              <h3 className="text-lg font-medium text-primary-800 mb-3">Educated</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Robotics',
                  'Machine Learning',
                  'Cryptography',
                  'Computer Vision',
                  'Autonomous Systems',
                  'Algorithm Design'
                ].map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-accent-50/50 text-accent-700 rounded-full text-sm transform hover:scale-105 transition-transform duration-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Education Section - Condensed */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-800 mb-6 flex items-center">
            <span className="bg-gradient-to-r from-primary-100/80 to-accent-50/50 px-6 py-3 rounded-lg shadow-sm">
              Education
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50">
              <h3 className="text-lg font-medium text-primary-800">MSc Autonomous Systems</h3>
              <p className="text-primary-700">Technische Universität Darmstadt</p>
              <p className="text-primary-600">2016 - 2023</p>
              <p className="text-primary-700 mt-2">Specialized in Machine Learning, Robotics, and Autonomous Systems</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50">
              <h3 className="text-lg font-medium text-primary-800">BSc Informatics</h3>
              <p className="text-primary-700">Technische Universität Darmstadt</p>
              <p className="text-primary-600">2009 - 2013</p>
              <p className="text-primary-700 mt-2">Focus on Software Engineering and Cryptography</p>
            </div>
          </div>
        </section>

        {/* Notable Projects Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-800 mb-6 flex items-center">
            <span className="bg-gradient-to-r from-primary-100/80 to-accent-50/50 px-6 py-3 rounded-lg shadow-sm">
              Notable Projects
            </span>
          </h2>
          <div className="space-y-8">
            <ProjectCard
              title="JCrypTool"
              description="Core contributor to the JCrypTool open-source project since graduating from high school. Responsible for GUI and core programming, project management, and documentation. It's a comprehensive Eclipse Rich Client Platform project with over 100 plug-ins providing cryptography functionality and visualizations. Current focus: Integrating the Bouncy Castle crypto provider library using Scala with a Domain Specific Language for generic GUI and console functionality. Long-term vision includes integration with Shapeless and Ammonite REPL, with plans to utilize Free Applicatives for theoretical foundation."
              image="/images/projects/jcryptool.png"
              technologies={['Java', 'Scala', 'Eclipse RCP', 'OSGi', 'Cryptography', 'GUI Development', 'Project Management']}
              company={{
                name: 'JCrypTool Project',
                logo: '/images/companies/jcryptool-logo.png'
              }}
            />
            <ProjectCard
              title="USB Guitar Teacher"
              description="Developed during a Virtual and Augmented Reality class, this project combines music and computing. Using an Arduino, modified a Western guitar for USB connectivity, enabling real-time fingering position detection. Created a guitar teacher application using marker-based computer vision with OpenCV for guitar position tracking and Openframeworks for OpenGL integration. The app visualizes chords and scale information directly on the guitar fretboard in the video feed."
              image="/images/projects/guitar-project.png"
              technologies={['Arduino', 'OpenCV', 'OpenGL', 'C++', 'Computer Vision', 'Hardware Integration', 'Real-time Processing']}
            />
            <ProjectCard
              title="Autonomous Systems Algorithm Development"
              description="At Spleenlab GmbH, developed sophisticated algorithms for autonomous systems and robotics. Successfully delivered a standalone product and completed a complex algorithm transcription to C99 with comprehensive test coverage. The work involved optimization for real-time performance and ensuring reliability in critical applications."
              image="/images/projects/autonomous-systems.png"
              technologies={['C99', 'C++', 'Robotics', 'Algorithm Design', 'Test-Driven Development', 'Performance Optimization']}
              company={{
                name: 'Spleenlab GmbH',
                logo: '/images/companies/spleenlab-logo.png'
              }}
            />
          </div>
        </section>

        {/* Languages Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-800 mb-6 flex items-center">
            <span className="bg-gradient-to-r from-primary-100/80 to-accent-50/50 px-6 py-3 rounded-lg shadow-sm">
              Languages
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-2xl mb-2">🇩🇪</div>
              <h3 className="text-lg font-semibold text-primary-800">German</h3>
              <p className="text-primary-600">Native</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-2xl mb-2">🇬🇧</div>
              <h3 className="text-lg font-semibold text-primary-800">English</h3>
              <p className="text-primary-600">Professional (C1/C2)</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-2xl mb-2">🇪🇸</div>
              <h3 className="text-lg font-semibold text-primary-800">Spanish</h3>
              <p className="text-primary-600">Advanced (B2)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
    </Layout>
  );
}
