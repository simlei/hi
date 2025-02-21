import { GoldenGraph } from '../components/GoldenGraph';
import { ProjectCard } from '../components/ProjectCard';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const projects = [
  {
    title: 'Project Management System',
    description: 'A comprehensive project management system built with React and Node.js. Features include task tracking, team collaboration, and real-time updates.',
    image: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/projects/project1.png`,
    technologies: ['React', 'Node.js', 'MongoDB', 'WebSocket'],
    company: {
      name: 'TechCorp',
      logo: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/companies/techcorp.png`
    }
  },
  {
    title: 'Data Analytics Platform',
    description: 'Advanced data analytics platform that processes and visualizes large datasets. Implements machine learning algorithms for predictive analytics.',
    image: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/projects/project2.png`,
    technologies: ['Python', 'TensorFlow', 'PostgreSQL', 'D3.js'],
    company: {
      name: 'DevSys',
      logo: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/companies/devsys.png`
    }
  },
  {
    title: 'E-commerce Solution',
    description: 'Scalable e-commerce platform with features like inventory management, payment processing, and analytics dashboard.',
    image: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/projects/project3.png`,
    technologies: ['Next.js', 'Stripe', 'Redis', 'AWS'],
    company: {
      name: 'CodeLabs',
      logo: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/companies/codelabs.png`
    }
  }
];

import { Layout } from '../components/Layout';

export default function Home() {
  return (
    <Layout title="Simon Leischnig - Software Engineer">
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50">
      <GoldenGraph />
      
      <div className="relative">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
            Building Tomorrow's
            <span className="text-primary-600"> Solutions</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mb-8">
            Software engineer specializing in full-stack development, 
            distributed systems, and cloud architecture. Turning complex 
            problems into elegant solutions.
          </p>
          <div className="flex gap-4">
            <Link
              href="/cv"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              View CV
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <a
              href="https://github.com/simlei"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-neutral-50 text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors border border-neutral-200"
            >
              GitHub Profile
            </a>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="px-6 py-16 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="px-6 py-16 bg-neutral-50/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-neutral-900 mb-8">
              Technical Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm border border-primary-100">
                <h3 className="text-xl font-semibold mb-4 text-primary-900">Frontend</h3>
                <ul className="space-y-2 text-neutral-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                    React & Next.js
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                    TypeScript
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                    TailwindCSS
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                    Redux
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm border border-primary-100">
                <h3 className="text-xl font-semibold mb-4 text-primary-900">Backend</h3>
                <ul className="space-y-2 text-neutral-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                    Node.js
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                    Python
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                    PostgreSQL
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                    Redis
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm border border-primary-100">
                <h3 className="text-xl font-semibold mb-4 text-primary-900">DevOps</h3>
                <ul className="space-y-2 text-neutral-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                    Docker
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                    Kubernetes
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                    AWS
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                    CI/CD
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    </Layout>
  );
}
