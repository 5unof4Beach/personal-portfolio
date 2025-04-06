// src/components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-gray-800">
          My Portfolio
        </Link>
        <div className="space-x-4">
          {/* Add navigation links here */}
          <Link href="/#about" className="text-gray-600 hover:text-gray-900">About</Link>
          <Link href="/#projects" className="text-gray-600 hover:text-gray-900">Projects</Link>
          <Link href="/#experience" className="text-gray-600 hover:text-gray-900">Experience</Link>
          <Link href="/articles" className="text-gray-600 hover:text-gray-900">Articles</Link>
          <Link href="/#contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          {/* Example Admin Link - potentially conditional */}
          {/* <Link href="/admin" className="text-gray-600 hover:text-gray-900">Admin</Link> */}
        </div>
      </nav>
    </header>
  );
} 
