'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-red-600">Something went wrong!</h1>
        <p className="mb-8 text-lg text-gray-700">
          We're sorry, but there was an error loading this page.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <button
            onClick={reset}
            className="rounded-md bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md bg-gray-200 px-6 py-3 text-gray-800 hover:bg-gray-300"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
} 
