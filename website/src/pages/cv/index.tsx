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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-900">Simon Leischnig</h1>
            <p className="text-lg text-primary-600">Software Engineer</p>
            
            <div className="mt-4 text-primary-700">
              <p>Email: simon.leischnig@stud.tu-darmstadt.de</p>
              <p>GitHub: <a href="http://github.com/simlei" className="text-accent-600 hover:text-accent-700">@simlei</a></p>
            </div>
          </div>

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
              <div>
                <h3 className="text-lg font-medium text-primary-700">Research Assistant - TU Darmstadt</h3>
                <p className="text-primary-500">2017</p>
                <p className="text-primary-600">Project organisation and management under Dr. Eichberg</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-700">Software Developer - Cynops GmbH</h3>
                <p className="text-primary-500">2009 - 2015</p>
                <p className="text-primary-600">Cryptography and Security</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-700">Freelance Developer - Lufthansa</h3>
                <p className="text-primary-500">2013 - 2014</p>
                <p className="text-primary-600">Mobile applications</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">Education</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-primary-700">MSc Autonomous Systems, Informatics</h3>
                <p className="text-primary-600">Technische Universität Darmstadt</p>
                <p className="text-primary-500">2013 - 2016</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-700">School of Informatics</h3>
                <p className="text-primary-600">Universidad Politécnica de Valencia</p>
                <p className="text-primary-500">2015 - 2016</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-700">BSc Informatics</h3>
                <p className="text-primary-600">Technische Universität Darmstadt</p>
                <p className="text-primary-500">2009 - 2013</p>
                <p className="text-primary-600">Thesis: Adaptris-Tetris with dynamic difficulty as implementation of the ISA algorithm</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">Publications</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-primary-700">A Kernel-based Approach to Learning Contact Distributions for Robot Manipulation Tasks</h3>
                <p className="text-primary-600">Kroemer, O.; Leischnig, S.; Luettgen, S.; Peters, J.</p>
                <p className="text-primary-500">Autonomous Robots (AuRo), 2017</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-700">A Comparison of Contact Distribution Representations for Learning to Predict Object Interactions</h3>
                <p className="text-primary-600">Leischnig, S.; Luettgen, S.; Kroemer, O.; Peters, J.</p>
                <p className="text-primary-500">IEEE-RAS International Conference on Humanoid Robots (Humanoids), 2015</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">Technical Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-lg font-medium text-primary-700">Languages</h3>
                <ul className="list-disc list-inside text-primary-600">
                  <li>Java, Scala</li>
                  <li>Python</li>
                  <li>C++</li>
                  <li>TypeScript</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-700">Technologies</h3>
                <ul className="list-disc list-inside text-primary-600">
                  <li>Git</li>
                  <li>UNIX</li>
                  <li>OSGi</li>
                  <li>Eclipse RCP</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-700">Domains</h3>
                <ul className="list-disc list-inside text-primary-600">
                  <li>Machine Learning</li>
                  <li>Computer Vision</li>
                  <li>Cryptography</li>
                  <li>Statistics</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">Languages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-primary-600">German (Native)</div>
              <div className="text-primary-600">English (C1/C2)</div>
              <div className="text-primary-600">Spanish (B2)</div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">Notable Projects</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-primary-700">JCrypTool</h3>
                <p className="text-primary-600">Core contributor to an open-source cryptography visualization tool built with Eclipse RCP. Implemented Bouncy Castle integration and developed a Scala-based DSL for generic GUI and console functionality.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-700">USB Guitar</h3>
                <p className="text-primary-600">Developed an Arduino-based system to convert guitar fingering to USB signals, combined with OpenCV marker tracking for an augmented reality guitar teaching application.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}