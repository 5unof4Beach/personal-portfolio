import React from "react";
import profileData from "@/data/profileData.json"; // Import data from JSON
import ProductArticles from "@/components/ProductArticles";
import Link from "next/link";
import BannerCarousel from "@/components/BannerCarousel";

export default function Home() {
  return (
    <main className="bg-stone-100 text-gray-900 font-sans">

      {/* Hero Section */}
      <section id="about" className="bg-stone-200">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="mb-3 text-4xl font-semibold md:text-5xl lg:text-6xl text-gray-900">
            {profileData.name}
          </h1>
          <p className="mb-6 text-xl md:text-2xl text-gray-700">
            {profileData.title}
          </p>
          {profileData.social && (
            <div className="flex justify-center space-x-5">
              {profileData.social.github && (
                <Link
                  href={profileData.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition duration-300"
                >
                  <svg
                    className="h-7 w-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </Link>
              )}
              {profileData.social.linkedin && (
                <Link
                  href={profileData.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition duration-300"
                >
                  <svg
                    className="h-7 w-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
              )}
              {profileData.social.twitter && (
                <Link
                  href={profileData.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition duration-300"
                >
                  <svg
                    className="h-7 w-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.385 4.482A13.978 13.978 0 011.67 3.15a4.92 4.92 0 001.525 6.575 4.876 4.876 0 01-2.23-.616v.061a4.923 4.923 0 003.95 4.827 4.996 4.996 0 01-2.224.084 4.932 4.932 0 004.6 3.42 9.875 9.875 0 01-6.115 2.107c-.398 0-.79-.023-1.175-.068a13.932 13.932 0 007.548 2.208c9.054 0 14-7.496 14-13.986 0-.21-.005-.42-.014-.63A9.987 9.987 0 0024 4.59z" />
                  </svg>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Carousel Section */}
      <section className="bg-stone-50">
        <BannerCarousel />
      </section>

      {/* About Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <h2 className="mb-8 text-center text-3xl font-semibold text-gray-800">
            About My Team
          </h2>
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
            <h2 className="mb-10 text-center text-3xl font-semibold text-gray-800">
              What we do
            </h2>
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
      <section>
        <ProductArticles />
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="bg-stone-800 py-16 md:py-20 text-stone-100"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-8 text-3xl font-semibold">Get In Touch</h2>
          <div className="mx-auto max-w-md">
            {profileData.contact && profileData.contact.email && (
              <div className="mb-4">
                <p className="text-lg">
                  <span className="font-medium">Email:</span>{" "}
                  <Link
                    href={`mailto:${profileData.contact.email}`}
                    className="underline hover:text-white transition duration-300"
                  >
                    {profileData.contact.email}
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
