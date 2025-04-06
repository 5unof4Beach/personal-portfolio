import React from 'react';
import Link from 'next/link';
import profileData from '@/data/profileData.json'; // Assuming this path is correct relative to the project root

const Footer = () => {
  return (
    <footer className="bg-stone-900 py-6 text-stone-400">
      <div className="container mx-auto px-6 text-center text-sm">
        <p>© {new Date().getFullYear()} {profileData.name}. All rights reserved.</p>
        <Link href="/articles" className="mt-2 inline-block text-xs text-stone-500 hover:text-stone-300 transition duration-300">
          Articles
        </Link>
      </div>
    </footer>
  );
};

export default Footer; 
