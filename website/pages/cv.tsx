import { GoldenGraph } from '../components/GoldenGraph';
import { Layout } from '../components/Layout';

export default function CV() {
  return (
    <Layout title="Simon Leischnig - CV">
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
      <GoldenGraph />
      
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-amber-100">
          <h1 className="text-3xl font-bold text-primary-900">Simon Leischnig</h1>
          <p className="text-lg text-primary-600">Autonomous Systems Master Student at TU Darmstadt</p>
          <div className="mt-4 text-primary-700 space-y-1">
            <p>Address: Am Teich 8, 07743 Jena, Germany</p>
            <p>Phone: 01590 / 5077 303</p>
            <p>Email: simon.leischnig@stud.tu-darmstadt.de</p>
            <p>GitHub: <a href="http://github.com/simlei" className="text-amber-600 hover:text-amber-700 transition-colors">@simlei</a></p>
            <p>Website: <a href="http://simlei.github.io/hi" className="text-amber-600 hover:text-amber-700 transition-colors">simlei.github.io/hi</a></p>
          </div>
        </div>

        {/* Education Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary-800 mb-4 flex items-center">
            <span className="bg-amber-100/50 px-4 py-2 rounded-lg">Education</span>
          </h2>
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-amber-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-primary-700">MSc Autonomous Systems, Informatics</h3>
              <p className="text-primary-600">Technische Universität Darmstadt</p>
              <p className="text-primary-500">2016 - Present</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-amber-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-primary-700">School of Informatics</h3>
              <p className="text-primary-600">Universidad Politécnica de Valencia</p>
              <p className="text-primary-500">2015 - 2016</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-amber-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-primary-700">MSc Autonomous Systems, Informatics</h3>
              <p className="text-primary-600">Technische Universität Darmstadt</p>
              <p className="text-primary-500">2013 - 2015</p>
              <p className="text-primary-600 mt-2">1-year Lab under Prof. Peters and Dr. Kroemer</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-amber-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-primary-700">BSc Informatics</h3>
              <p className="text-primary-600">Technische Universität Darmstadt</p>
              <p className="text-primary-500">2009 - 2013</p>
              <p className="text-primary-600 mt-2">Thesis: Adaptris-Tetris with dynamic difficulty as implementation of the ISA algorithm</p>
            </div>
          </div>
        </section>

        {/* Work Experience Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary-800 mb-4 flex items-center">
            <span className="bg-amber-100/50 px-4 py-2 rounded-lg">Work Experience</span>
          </h2>
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-amber-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-primary-700">Research Assistant - TU Darmstadt</h3>
              <p className="text-primary-500">2017</p>
              <p className="text-primary-600">Project organisation and management under Dr. Eichberg</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-amber-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-primary-700">Research Assistant - TU Darmstadt</h3>
              <p className="text-primary-500">2014</p>
              <p className="text-primary-600">Recommender systems lab under Prof. Brefeld</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-amber-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-primary-700">Software Developer - Cynops GmbH</h3>
              <p className="text-primary-500">2009 - 2015</p>
              <p className="text-primary-600">Cryptography and Security</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-amber-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-primary-700">Freelance Developer - Lufthansa</h3>
              <p className="text-primary-500">2013 - 2014</p>
              <p className="text-primary-600">Mobile applications</p>
            </div>
          </div>
        </section>

        {/* Publications Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary-800 mb-4 flex items-center">
            <span className="bg-amber-100/50 px-4 py-2 rounded-lg">Publications</span>
          </h2>
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-amber-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-primary-700">A Kernel-based Approach to Learning Contact Distributions for Robot Manipulation Tasks</h3>
              <p className="text-primary-600">Kroemer, O.; Leischnig, S.; Luettgen, S.; Peters, J.</p>
              <p className="text-primary-500">Autonomous Robots (AuRo), 2017</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-amber-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-primary-700">A Comparison of Contact Distribution Representations for Learning to Predict Object Interactions</h3>
              <p className="text-primary-600">Leischnig, S.; Luettgen, S.; Kroemer, O.; Peters, J.</p>
              <p className="text-primary-500">IEEE-RAS International Conference on Humanoid Robots (Humanoids), 2015</p>
            </div>
          </div>
        </section>

        {/* Technical Skills Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary-800 mb-4 flex items-center">
            <span className="bg-amber-100/50 px-4 py-2 rounded-lg">Technical Skills</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-amber-50">
              <h3 className="text-lg font-medium text-primary-700 mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {['Java', 'Scala', 'Python', 'C++', 'JavaScript', 'TypeScript'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-amber-50">
              <h3 className="text-lg font-medium text-primary-700 mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {['Git', 'UNIX', 'OSGi', 'Eclipse RCP', 'LaTeX', 'HTML/CSS'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-amber-50">
              <h3 className="text-lg font-medium text-primary-700 mb-3">Domains</h3>
              <div className="flex flex-wrap gap-2">
                {['Machine Learning', 'Computer Vision', 'Cryptography', 'Statistics'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Languages Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary-800 mb-4 flex items-center">
            <span className="bg-amber-100/50 px-4 py-2 rounded-lg">Languages</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-amber-50 text-center">
              <span className="text-primary-700 font-medium">German (Native)</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-amber-50 text-center">
              <span className="text-primary-700 font-medium">English (C1/C2)</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-amber-50 text-center">
              <span className="text-primary-700 font-medium">Spanish (B2)</span>
            </div>
          </div>
        </section>

        {/* Notable Projects Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary-800 mb-4 flex items-center">
            <span className="bg-amber-100/50 px-4 py-2 rounded-lg">Notable Projects</span>
          </h2>
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-amber-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-primary-700">JCrypTool</h3>
              <p className="text-primary-600">Core contributor to the <a href="https://github.com/jcryptool" className="text-amber-600 hover:text-amber-700 transition-colors">JCrypTool</a> open-source project since graduating from high school. Responsible for GUI and core programming, project management, and documentation. It's a comprehensive Eclipse Rich Client Platform project with over 100 plug-ins providing cryptography functionality and visualizations.</p>
              <p className="text-primary-600 mt-2">Current focus: Integrating the <a href="https://www.bouncycastle.org/" className="text-amber-600 hover:text-amber-700 transition-colors">Bouncy Castle crypto provider library</a> using Scala with a Domain Specific Language for generic GUI and console functionality. Long-term vision includes integration with <a href="https://github.com/milessabin/shapeless" className="text-amber-600 hover:text-amber-700 transition-colors">Shapeless</a> and <a href="http://ammonite.io" className="text-amber-600 hover:text-amber-700 transition-colors">Ammonite</a> REPL, with plans to utilize Free Applicatives for theoretical foundation.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-amber-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-primary-700">USB Guitar</h3>
              <p className="text-primary-600">Developed during a Virtual and Augmented Reality class, this project combines music and computing. Using an <a href="https://www.arduino.cc/" className="text-amber-600 hover:text-amber-700 transition-colors">Arduino</a>, modified a Western guitar for USB connectivity, enabling real-time fingering position detection.</p>
              <p className="text-primary-600 mt-2">Created a guitar teacher application using marker-based computer vision with <a href="http://opencv.org/" className="text-amber-600 hover:text-amber-700 transition-colors">OpenCV</a> for guitar position tracking and <a href="http://openframeworks.cc/" className="text-amber-600 hover:text-amber-700 transition-colors">Openframeworks</a> for OpenGL integration. The app visualizes chords and scale information directly on the guitar fretboard in the video feed. Full project documentation available at <a href="https://simlei.github.io/VAR2017Project" className="text-amber-600 hover:text-amber-700 transition-colors">simlei.github.io/VAR2017Project</a>.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
    </Layout>
  );
}
