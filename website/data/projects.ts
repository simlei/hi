export interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  company?: {
    name: string;
    logo: string;
  };
}

export const projects: Project[] = [
  {
    title: 'JCrypTool',
    description: "I worked on JCrypTool for a long time during my studies; it basically taught me the practical side of project management and writing Java, my first enterprise language. I was core maintainer for many years. I then worked there 3 years as project lead, responsible for GUI and core programming, and for the release of v1.0. It's an Eclipse Rich Client Platform project with over 100 plug-ins providing cryptography functionality and visualizations.",
    image: '/images/projects/jcryptool.png',
    technologies: ['Java', 'Scala', 'Eclipse RCP', 'OSGi', 'Cryptography', 'GUI Development', 'Project Management'],
    company: {
      url: 'https://www.cryptool.org/en/jcryptool',
      name: 'JCrypTool Project',
      logo: '/images/companies/jcryptool-logo.png'
    }
  },
  {
    title: 'USB Guitar Teacher',
    description: 'Developed during a Virtual and Augmented Reality class, this project combines music and computing. Using an Arduino, modified a Western guitar for USB connectivity, enabling real-time fingering position detection. Created a guitar teacher application using marker-based computer vision with OpenCV for guitar position tracking and Openframeworks for OpenGL integration.',
    image: '/images/projects/guitar-project.png',
    technologies: ['Arduino', 'OpenCV', 'OpenGL', 'C++', 'Computer Vision', 'Hardware Integration', 'Real-time Processing']
  },
  {
    title: 'Autonomous Systems Algorithm Development',
    description: 'At Spleenlab GmbH, developed sophisticated algorithms for autonomous systems and robotics. Successfully delivered a standalone product and completed a complex algorithm transcription to C99 with comprehensive test coverage. The work involved optimization for real-time performance and ensuring reliability in critical applications.',
    image: '/images/projects/autonomous-systems.png',
    technologies: ['C99', 'C++', 'Robotics', 'Algorithm Design', 'Test-Driven Development', 'Performance Optimization'],
    company: {
      name: 'Spleenlab GmbH',
      logo: '/images/companies/spleenlab-logo.png'
    }
  }
];
