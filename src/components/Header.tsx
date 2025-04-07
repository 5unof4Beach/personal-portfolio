// src/components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-gray-800">
          Duc Bui
        </Link>
        <div className="space-x-4 font-medium">
          <Link href="/#about" className="text-gray-600 hover:text-gray-900">About</Link>
          <Link href="/#projects" className="text-gray-600 hover:text-gray-900">Products</Link>
          {/* <Link href="/#experience" className="text-gray-600 hover:text-gray-900">Experience</Link> */}
          <Link href="/articles" className="text-gray-600 hover:text-gray-900">Articles</Link>
          <Link href="/#contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
        </div>
      </nav>
    </header>
  );
} 
