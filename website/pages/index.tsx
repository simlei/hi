import { GraphBackground } from '../components/GraphBackground';
import { ProjectCard } from '../components/ProjectCard';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { projects } from '../data/projects';
import { Layout } from '../components/Layout';

export default function Home() {
  return (
    <Layout title="Simon Leischnig - Software Engineer">
    <div className="min-h-screen relative bg-transparent">
      <GraphBackground />
      
      <div className="relative z-10 bg-transparent">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 flex flex-col items-center justify-center text-center">
          <div className="inline-block">
            <div className="backdrop-blur-sm bg-white/30 rounded-2xl p-8 shadow-lg border border-white/40">
              <h1 className="text-4xl md:text-4xl font-bold text-primary-900 mb-6">
                Hi, I'm Simon Leischnig.
              </h1>
              <p className="text-xl text-primary-800 max-w-2xl mb-8">
                I'm a software developer based in Jena, Germany. Software that "knows itself" is my passion. Check out my "ManageBash" project if you are a developer that hops between machines and containers often, go on :)
              </p>
              <div className="flex gap-4">
                <Link
                  href="/cv"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                >
                  View CV
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <a
                  href="https://github.com/simlei"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/80 text-neutral-700 rounded-lg hover:bg-white transition-colors border border-white/60 shadow-sm"
                >
                  GitHub Profile
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-primary-800 mb-8 flex items-center">
              <span className="bg-gradient-to-r from-primary-100/80 to-accent-50/50 px-6 py-3 rounded-lg shadow-sm">
                Featured Projects
              </span>
            </h2>
            <div className="space-y-8">
              {projects.map((project) => (
                <ProjectCard key={project.title} {...project} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
    </Layout>
  );
}
