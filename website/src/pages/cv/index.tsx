import Link from 'next/link';
import Head from 'next/head';

export default function CV() {
  return (
    <div className="min-h-screen bg-primary-50">
      <Head>
        <title>Simon Jena - Curriculum Vitae</title>
        <meta name="description" content="Curriculum Vitae of Simon Jena - Software Engineer, Autonomous Systems Master Student at TU Darmstadt" />
      </Head>
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
            <p className="text-lg text-primary-600">Autonomous Systems Master Student at TU Darmstadt</p>
            
            <div className="mt-4 text-primary-700">
              <p>Address: Am Teich 8, 07743 Jena, Germany</p>
              <p>Phone: 01590 / 5077 303</p>
              <p>Email: simon.leischnig@stud.tu-darmstadt.de</p>
              <p>GitHub: <a href="http://github.com/simlei" className="text-accent-600 hover:text-accent-700">@simlei</a></p>
              <p>Website: <a href="http://simlei.github.io/hi" className="text-accent-600 hover:text-accent-700">simlei.github.io/hi</a></p>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">Education</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-primary-700">MSc Autonomous Systems, Informatics</h3>
                <p className="text-primary-600">Technische Universität Darmstadt</p>
                <p className="text-primary-500">2016 - Present</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-700">School of Informatics</h3>
                <p className="text-primary-600">Universidad Politécnica de Valencia</p>
                <p className="text-primary-500">2015 - 2016</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-700">MSc Autonomous Systems, Informatics</h3>
                <p className="text-primary-600">Technische Universität Darmstadt</p>
                <p className="text-primary-500">2013 - 2015</p>
                <p className="text-primary-600">1-year Lab under Prof. Peters and Dr. Kroemer</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-700">BSc Informatics</h3>
                <p className="text-primary-600">Technische Universität Darmstadt</p>
                <p className="text-primary-500">2009 - 2013</p>
                <p className="text-primary-600">Thesis: Adaptris-Tetris with dynamic difficulty as implementation of the ISA algorithm</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-700">Highschool</h3>
                <p className="text-primary-600">Carl-Zeiss-Gymnasium Jena</p>
                <p className="text-primary-500">2008</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">Work Experience</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-primary-700">Research Assistant - TU Darmstadt</h3>
                <p className="text-primary-500">2017</p>
                <p className="text-primary-600">Project organisation and management under Dr. Eichberg</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-700">Research Assistant - TU Darmstadt</h3>
                <p className="text-primary-500">2014</p>
                <p className="text-primary-600">Recommender systems lab under Prof. Brefeld</p>
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
              <div>
                <h3 className="text-lg font-medium text-primary-700">Internships</h3>
                <p className="text-primary-500">2007 - 2008</p>
                <p className="text-primary-600">Eset Germany and Deutsche Bank (two months each)</p>
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
                  <li>Java, Scala, scalaz</li>
                  <li>Python</li>
                  <li>C++</li>
                  <li>JavaScript, TypeScript</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-700">Technologies</h3>
                <ul className="list-disc list-inside text-primary-600">
                  <li>Git</li>
                  <li>UNIX</li>
                  <li>OSGi, Eclipse RCP</li>
                  <li>Java SWT, JavaFX</li>
                  <li>Ammonite Shell</li>
                  <li>LaTeX</li>
                  <li>HTML, CSS</li>
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
                <p className="text-primary-600">Core contributor to the <a href="https://github.com/jcryptool" className="text-accent-600 hover:text-accent-700">JCrypTool</a> open-source project since graduating from high school. Responsible for GUI and core programming, project management, and documentation. It's a comprehensive Eclipse Rich Client Platform project with over 100 plug-ins providing cryptography functionality and visualizations.</p>
                <p className="text-primary-600 mt-2">Current focus: Integrating the <a href="https://www.bouncycastle.org/" className="text-accent-600 hover:text-accent-700">Bouncy Castle crypto provider library</a> using Scala with a Domain Specific Language for generic GUI and console functionality. Long-term vision includes integration with <a href="https://github.com/milessabin/shapeless" className="text-accent-600 hover:text-accent-700">Shapeless</a> and <a href="http://ammonite.io" className="text-accent-600 hover:text-accent-700">Ammonite</a> REPL, with plans to utilize Free Applicatives for theoretical foundation.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-700">USB Guitar</h3>
                <p className="text-primary-600">Developed during a Virtual and Augmented Reality class, this project combines music and computing. Using an <a href="https://www.arduino.cc/" className="text-accent-600 hover:text-accent-700">Arduino</a>, modified a Western guitar for USB connectivity, enabling real-time fingering position detection.</p>
                <p className="text-primary-600 mt-2">Created a guitar teacher application using marker-based computer vision with <a href="http://opencv.org/" className="text-accent-600 hover:text-accent-700">OpenCV</a> for guitar position tracking and <a href="http://openframeworks.cc/" className="text-accent-600 hover:text-accent-700">Openframeworks</a> for OpenGL integration. The app visualizes chords and scale information directly on the guitar fretboard in the video feed. Full project documentation available at <a href="https://simlei.github.io/VAR2017Project" className="text-accent-600 hover:text-accent-700">simlei.github.io/VAR2017Project</a>.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}