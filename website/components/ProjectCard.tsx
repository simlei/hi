import { useState, useRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  company?: {
    name: string;
    logo: string;
  };
}

export function ProjectCard({ title, description, image, technologies, company }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={cardRef}
        className={`transform transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div
          onClick={() => setIsOpen(true)}
          className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border border-primary-100 w-full transform hover:-rotate-1 hover:scale-[1.02]"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 relative h-48">
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={title}
                  width={800}
                  height={600}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <div className="flex-1 p-6 relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-100 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
              <h3 className="text-xl font-semibold text-primary-800 mb-2">{title}</h3>
              <p className="text-primary-700 mb-4">{description.substring(0, 150)}...</p>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-accent-50 text-accent-800 rounded-full text-sm transform hover:scale-110 transition-transform duration-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              {company && (
                <div className="mt-4 flex items-center">
                  <div className="h-6 w-24">
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={400}
                      height={200}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="ml-2 text-primary-600 text-sm">{company.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm p-8 shadow-xl transition-all border border-primary-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="mb-4 rounded-lg overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                        <Image
                          src={image}
                          alt={title}
                          width={800}
                          height={600}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                      {company && (
                        <div className="flex items-center p-4 bg-primary-50/50 rounded-lg">
                          <div className="h-10 w-40">
                            <Image
                              src={company.logo}
                              alt={company.name}
                              width={400}
                              height={200}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="ml-4 text-primary-700 font-medium">{company.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Dialog.Title className="text-2xl font-bold text-primary-800 mb-4">
                        {title}
                      </Dialog.Title>

                      <div className="prose max-w-none text-primary-700">
                        <p>{description}</p>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-primary-700 mb-3">
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-4 py-2 bg-accent-50 text-accent-800 rounded-full text-sm font-medium transform hover:scale-110 hover:-rotate-2 transition-all duration-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setIsOpen(false)}
                        className="mt-8 px-6 py-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-all duration-300 text-primary-800 border border-primary-200 transform hover:scale-105 hover:shadow-md"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}