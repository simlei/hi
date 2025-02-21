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
          className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="aspect-w-4 aspect-h-3">
            <div className="relative w-full h-full">
              <Image
                src={image}
                alt={title}
                fill
                loading="lazy"
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm opacity-90">{description.substring(0, 100)}...</p>
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <div className="relative w-full h-full">
                      <Image
                        src={image}
                        alt={title}
                        fill
                        quality={90}
                        sizes="(max-width: 1200px) 100vw, 75vw"
                        priority
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title className="text-2xl font-semibold">
                      {title}
                    </Dialog.Title>
                    {company && (
                      <div className="flex items-center">
                        <div className="relative h-8 w-32">
                          <Image
                            src={company.logo}
                            alt={company.name}
                            fill
                            quality={90}
                            sizes="128px"
                            className="object-contain"
                          />
                        </div>
                        <span className="ml-2 text-gray-600">{company.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="prose max-w-none">
                    <p>{description}</p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}