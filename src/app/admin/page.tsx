'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session || !session.user) {
    return null; // This will be handled by middleware
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <span className="text-xl font-bold">Portfolio Admin</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-sm text-gray-600">
                Welcome, {session.user.name}
              </span>
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">Dashboard</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Manage Articles"
            description="Update your social media links and contact information"
            link="/admin/articles"
          />
          <DashboardCard
            title="View Portfolio"
            description="Preview your portfolio as visitors will see it"
            link="/"
            isExternal
          />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  link,
  isExternal = false,
}: {
  title: string;
  description: string;
  link: string;
  isExternal?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
        <div className="mt-4">
          {isExternal ? (
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700"
            >
              Visit
            </Link>
          ) : (
            <Link
              href={link}
              className="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700"
            >
              Manage
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 
