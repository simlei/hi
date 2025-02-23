import { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { MouseProvider, useMouseContext } from '../contexts/MouseContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

function LayoutContent({ children, title = 'Portfolio' }: LayoutProps) {
  const { handlePointerMove, handlePointerDown } = useMouseContext();

  return (
    <div 
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      className="min-h-screen"
    >
      <Head>
        <title>{title}</title>
        <meta name="description" content="Professional portfolio and CV" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm border-b border-primary-100">
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-primary-900">
              hi
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-neutral-600 hover:text-primary-700 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/cv"
                className="text-neutral-600 hover:text-primary-700 transition-colors"
              >
                CV
              </Link>
              <a
                href="https://github.com/simlei"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-primary-700 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-16">{children}</main>

      <footer className="bg-white/80 backdrop-blur-sm mt-16 border-t border-primary-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-600">
              © {new Date().getFullYear()} Simon Leischnig. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="mailto:simonjena@gmail.com"
                className="text-neutral-600 hover:text-primary-700 transition-colors"
              >
                Email
              </a>
              <a
                href="https://github.com/simlei"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-primary-700 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Layout(props: LayoutProps) {
  return (
    <MouseProvider>
      <LayoutContent {...props} />
    </MouseProvider>
  );
}
