import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import profileData from '@/data/profileData.json'; // Import data from JSON

// Helper function to format date ranges
const formatDateRange = (from: string, to: string | null, current: boolean): string => {
  const fromYear = new Date(from).getFullYear();
  if (current) {
    return `${fromYear} - Present`;
  }
  if (to) {
    const toYear = new Date(to).getFullYear();
    return `${fromYear} - ${toYear}`;
  }
  return `${fromYear}`;
};

// Define the Project interface based on profileData.json
interface Project {
  title: string;
  description: string;
  technologies: string[];
  link?: string; // Made optional as it might not always be present
  image?: string; // Made optional
}

// Define types for other potentially mapped items for consistency (optional but good practice)
interface Experience {
  title: string;
  company: string;
  location: string;
  from: string;
  to: string | null;
  current: boolean;
  description: string;
}

export default function Home() {
  return (
    <main className="bg-stone-100 text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="bg-stone-200">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="mb-3 text-4xl font-semibold md:text-5xl lg:text-6xl text-gray-900">
            {profileData.name}
          </h1>
          <p className="mb-6 text-xl md:text-2xl text-gray-700">{profileData.title}</p>
          {profileData.social && (
            <div className="flex justify-center space-x-5">
              {profileData.social.github && (
                <a href={profileData.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition duration-300">
                  <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              )}
              {profileData.social.linkedin && (
                <a href={profileData.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition duration-300">
                  <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}
              {profileData.social.twitter && (
                <a href={profileData.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition duration-300">
                  <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.385 4.482A13.978 13.978 0 011.67 3.15a4.92 4.92 0 001.525 6.575 4.876 4.876 0 01-2.23-.616v.061a4.923 4.923 0 003.95 4.827 4.996 4.996 0 01-2.224.084 4.932 4.932 0 004.6 3.42 9.875 9.875 0 01-6.115 2.107c-.398 0-.79-.023-1.175-.068a13.932 13.932 0 007.548 2.208c9.054 0 14-7.496 14-13.986 0-.21-.005-.42-.014-.63A9.987 9.987 0 0024 4.59z" />
                  </svg>
                </a>
              )}
              {profileData.social.website && (
                <a href={profileData.social.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition duration-300">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <h2 className="mb-8 text-center text-3xl font-semibold text-gray-800">About My Team</h2>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              {profileData.about}
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {profileData.skills && profileData.skills.length > 0 && (
        <section className="bg-stone-50 py-16 md:py-20">
          <div className="container mx-auto px-6">
            <h2 className="mb-10 text-center text-3xl font-semibold text-gray-800">Skills</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {profileData.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="rounded-md bg-stone-200 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {profileData.projects && profileData.projects.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6">
            <h2 className="mb-10 text-center text-3xl font-semibold text-gray-800">Projects</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {profileData.projects.map((project: Project, index: number) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  {project.image && (
                    <div className="relative h-48 w-full bg-stone-200">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-semibold">{project.title}</h3>
                    <p className="mb-4 text-sm text-gray-600">{project.description}</p>
                    <div className="mb-4 flex flex-wrap gap-2 justify-center">
                      {project.technologies.map((tech: string, techIndex: number) => (
                        <span
                          key={techIndex}
                          className="rounded bg-stone-100 px-2 py-1 text-xs font-medium text-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block rounded bg-stone-800 px-4 py-2 text-sm font-medium text-white transition duration-300 hover:bg-stone-900"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {profileData.experience && profileData.experience.length > 0 && (
        <section className="bg-stone-50 py-16 md:py-20">
          <div className="container mx-auto px-6">
            <h2 className="mb-10 text-center text-3xl font-semibold text-gray-800">Experience</h2>
            <div className="mx-auto max-w-3xl space-y-8 text-center">
              {profileData.experience.map((job: Experience, index: number) => (
                <div
                  key={index}
                  className="rounded-md border-l-4 border-stone-400 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <p className="text-lg font-medium text-gray-800">{job.company}</p>
                  <p className="mb-2 text-sm text-gray-500">
                    {job.location} | {formatDateRange(job.from, job.to, job.current)}
                  </p>
                  <p className="text-gray-700">{job.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="bg-stone-800 py-16 md:py-20 text-stone-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-8 text-3xl font-semibold">Get In Touch</h2>
          <div className="mx-auto max-w-md">
            {profileData.contact && profileData.contact.email && (
              <div className="mb-4">
                <p className="text-lg">
                  <span className="font-medium">Email:</span>{' '}
                  <a
                    href={`mailto:${profileData.contact.email}`}
                    className="underline hover:text-white transition duration-300"
                  >
                    {profileData.contact.email}
                  </a>
                </p>
              </div>
            )}
            {profileData.contact && profileData.contact.phone && (
              <div>
                <p className="text-lg">
                  <span className="font-medium">Phone:</span>{' '}
                  <a
                    href={`tel:${profileData.contact.phone}`}
                    className="underline hover:text-white transition duration-300"
                  >
                    {profileData.contact.phone}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 py-6 text-stone-400">
        <div className="container mx-auto px-6 text-center text-sm">
          <p>© {new Date().getFullYear()} {profileData.name}. All rights reserved.</p>
          <Link href="/articles" className="mt-2 inline-block text-xs text-stone-500 hover:text-stone-300 transition duration-300">
            Blogs
          </Link>
        </div>
      </footer>
    </main>
  );
}
