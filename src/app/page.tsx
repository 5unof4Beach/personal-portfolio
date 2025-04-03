import Link from 'next/link';
import Image from 'next/image';
import connectToDatabase from '@/lib/mongodb';
import Profile from '@/models/Profile';

// Define interface for profile data
interface ProfileData {
  name: string;
  title: string;
  about: string;
  skills?: string[];
  experience?: Array<{
    title: string;
    company: string;
    location: string;
    from: Date;
    to: Date;
    current: boolean;
    description: string;
  }>;
  education?: Array<{
    school: string;
    degree: string;
    fieldOfStudy: string;
    from: Date;
    to: Date;
    current: boolean;
    description: string;
  }>;
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    image?: string;
  }>;
  social?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
  };
}

async function getProfileData(): Promise<ProfileData | null> {
  try {
    await connectToDatabase();
    const profile = await Profile.findOne({}).lean();
    return profile ? (profile as unknown as ProfileData) : null;
  } catch (error) {
    console.error('Error getting profile data:', error);
    return null;
  }
}

export default async function Home() {
  const profileData = await getProfileData();

  // If no profile data exists, show setup prompt
  if (!profileData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="mb-4 text-3xl font-bold">Welcome to Your Portfolio</h1>
          <p className="mb-6 text-gray-600">
            It looks like you haven&apos;t set up your portfolio yet. Create an admin
            account to get started.
          </p>
          <Link
            href="/admin/setup"
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Set Up Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
            {profileData.name}
          </h1>
          <p className="mb-8 text-xl md:text-2xl">{profileData.title}</p>
          {profileData.social && (
            <div className="flex justify-center space-x-4">
              {profileData.social.github && (
                <a href={profileData.social.github} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              )}
              {profileData.social.linkedin && (
                <a href={profileData.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}
              {profileData.social.twitter && (
                <a href={profileData.social.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.385 4.482A13.978 13.978 0 011.67 3.15a4.92 4.92 0 001.525 6.575 4.876 4.876 0 01-2.23-.616v.061a4.923 4.923 0 003.95 4.827 4.996 4.996 0 01-2.224.084 4.932 4.932 0 004.6 3.42 9.875 9.875 0 01-6.115 2.107c-.398 0-.79-.023-1.175-.068a13.932 13.932 0 007.548 2.208c9.054 0 14-7.496 14-13.986 0-.21-.005-.42-.014-.63A9.987 9.987 0 0024 4.59z" />
                  </svg>
                </a>
              )}
              {profileData.social.website && (
                <a href={profileData.social.website} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">About Me</h2>
          <div className="mx-auto max-w-3xl">
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              {profileData.about}
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {profileData.skills && profileData.skills.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-3xl font-bold">Skills</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {profileData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
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
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-3xl font-bold">Projects</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {profileData.projects.map((project, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg bg-white shadow-lg"
                >
                  {project.image && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold">{project.title}</h3>
                    <p className="mb-4 text-gray-700">{project.description}</p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
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
                        className="mt-2 inline-block rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
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
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-3xl font-bold">Experience</h2>
            <div className="mx-auto max-w-3xl space-y-8">
              {profileData.experience.map((job, index) => (
                <div
                  key={index}
                  className="rounded-lg border-l-4 border-indigo-600 bg-white p-6 shadow-md"
                >
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="text-lg font-medium">{job.company}</p>
                  <p className="mb-2 text-gray-600">
                    {job.location} | {new Date(job.from).getFullYear()} - 
                    {job.current
                      ? ' Present'
                      : ` ${new Date(job.to).getFullYear()}`}
                  </p>
                  <p className="text-gray-700">{job.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {profileData.education && profileData.education.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-3xl font-bold">Education</h2>
            <div className="mx-auto max-w-3xl space-y-8">
              {profileData.education.map((edu, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white p-6 shadow-md"
                >
                  <h3 className="text-xl font-bold">{edu.degree}</h3>
                  <p className="text-lg font-medium">{edu.school}</p>
                  <p className="mb-2 text-gray-600">
                    {edu.fieldOfStudy} | {new Date(edu.from).getFullYear()} - 
                    {edu.current
                      ? ' Present'
                      : ` ${new Date(edu.to).getFullYear()}`}
                  </p>
                  <p className="text-gray-700">{edu.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="bg-indigo-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-8 text-3xl font-bold">Get In Touch</h2>
          <div className="mx-auto max-w-md">
            {profileData.contact && profileData.contact.email && (
              <div className="mb-4">
                <p className="text-lg">
                  <span className="font-medium">Email:</span>{' '}
                  <a
                    href={`mailto:${profileData.contact.email}`}
                    className="underline hover:text-gray-200"
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
                    className="underline hover:text-gray-200"
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
      <footer className="bg-gray-900 py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} {profileData.name}. All rights reserved.</p>
          {/* Admin link - hidden visually but accessible for admins */}
          <Link href="/admin/login" className="mt-4 text-xs text-gray-500 hover:text-gray-400">
            Admin Login
          </Link>
        </div>
      </footer>
    </main>
  );
}
