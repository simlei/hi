import { GoldenGraph } from '../components/GoldenGraph';
import { Layout } from '../components/Layout';
import { ProjectCard } from '../components/ProjectCard';
import { projects } from '../data/projects';

export default function CV() {
  return (
    <Layout title="Simon Leischnig - CV">
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50">
      <GoldenGraph />
      
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-primary-100">
          <h1 className="text-3xl font-bold text-primary-900">Curriculum Vitæ of Simon Leischnig</h1>
          <p className="text-lg text-primary-700">Software and Algorithms Engineer</p>
          <div className="mt-4 text-primary-700/90 space-y-1">
            <p>Address: Karl-Liebknecht-Str. 33, 07749, Jena, Germany</p>
            <p>Phone: 015209975863</p>
            <p>Email: simonjena@gmail.com</p>
            <p>GitHub: <a href="http://github.com/simlei" className="text-accent-700 hover:text-accent-800 transition-colors">@simlei</a></p>
            <p>Website: <a href="http://simlei.github.io/hi" className="text-accent-700 hover:text-accent-800 transition-colors">simlei.github.io/hi</a></p>
          </div>
        </div>

        {/* Work Experience Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-800 mb-6 flex items-center">
            <span className="bg-gradient-to-br from-primary-100/90 via-accent-50/60 to-primary-50/80 px-6 py-3 rounded-lg shadow-sm border border-primary-100/20">
              Professional Experience
            </span>
          </h2>
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-semibold text-primary-800">Software and Algorithms Engineer - Spleenlab GmbH</h3>
              <p className="text-primary-600">May 2023 - Present</p>
              <p className="text-primary-700">Developing algorithms for autonomous systems and robotics. Successfully prototyped, branded and maintained a standalone product with customers, and completed a complex algorithm transcription to C99 with comprehensive test coverage that met it's performance goals on the first try while matching the spec 100%.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-semibold text-primary-800">Project Lead JCrypTool - Esslinger IT Consulting</h3>
              <p className="text-primary-600">2019 - 2023</p>
              <p className="text-primary-700">Leading the core development and dev-ops initiatives for the JCrypTool project, managing plugin architecture and deployment infrastructure.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-semibold text-primary-800">Software Developer - Cynops GmbH</h3>
              <p className="text-primary-600">2009 - 2015</p>
              <p className="text-primary-700">Developing cryptography and security solutions, focusing on robust implementation and system integration.</p>
            </div>
          </div>
        </section>

        {/* Publications Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-800 mb-6 flex items-center">
            <span className="bg-gradient-to-br from-primary-100/90 via-accent-50/60 to-primary-50/80 px-6 py-3 rounded-lg shadow-sm border border-primary-100/20">
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
            <span className="bg-gradient-to-br from-primary-100/90 via-accent-50/60 to-primary-50/80 px-6 py-3 rounded-lg shadow-sm border border-primary-100/20">
              Technical Skills
            </span>
          </h2>
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50">
              <h3 className="text-lg font-semibold text-primary-800 mb-3">Expert Level</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'DevOps',
                  'Bash',
                  'Scala 2/3',
                  'Java',
                  'GUI-frameworks',
                  'Maven',
                  'Docker',
                  'Git',
                  'Linux',
                  'Software Architecture'
                ].map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-primary-100/90 text-primary-900 rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50">
              <h3 className="text-lg font-semibold text-primary-800 mb-3">Additional Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'C++',
                  'C99',
                  'Rust',
                  'TypeScript',
                  'CI/CD',
                  'React, Next.js',
                  'System Design',
                  'Build Systems',
                  'Test Automation'
                ].map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-primary-50/80 text-primary-800 rounded-lg text-sm">
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
            <span className="bg-gradient-to-br from-primary-100/90 via-accent-50/60 to-primary-50/80 px-6 py-3 rounded-lg shadow-sm border border-primary-100/20">
              Education
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50">
              <h3 className="text-lg font-semibold text-primary-800">MSc Autonomous Systems</h3>
              <p className="text-primary-700">Technische Universität Darmstadt</p>
              <p className="text-primary-600">Graduated 2023</p>
              <p className="text-primary-700 mt-2">Advanced research in Machine Learning, Robotics, and Autonomous Systems. Completed while maintaining professional roles in software development.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-primary-50">
              <h3 className="text-lg font-semibold text-primary-800">BSc Informatics</h3>
              <p className="text-primary-700">Technische Universität Darmstadt</p>
              <p className="text-primary-600">Graduated 2013</p>
              <p className="text-primary-700 mt-2">Core focus on Software Engineering and Cryptography. Foundation for professional work in security and systems development.</p>
            </div>
          </div>
        </section>

        {/* Notable Projects Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-800 mb-6 flex items-center">
            <span className="bg-gradient-to-br from-primary-100/90 via-accent-50/60 to-primary-50/80 px-6 py-3 rounded-lg shadow-sm border border-primary-100/20">
              Notable Projects
            </span>
          </h2>
          <div className="space-y-8">
            {projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>

        {/* Languages Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-800 mb-6 flex items-center">
            <span className="bg-gradient-to-br from-primary-100/90 via-accent-50/60 to-primary-50/80 px-6 py-3 rounded-lg shadow-sm border border-primary-100/20">
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
              <p className="text-primary-600">B1</p>
            </div>
          </div>
        </section>
      </div>
    </div>
    </Layout>
  );
}
