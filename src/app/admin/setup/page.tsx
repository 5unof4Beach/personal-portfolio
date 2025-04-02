'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setupKey, setSetupKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      const response = await fetch('/api/admin/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          setupKeyProvided: setupKey,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to create admin account');
        return;
      }

      setSuccess('Admin account created successfully! Redirecting to login...');
      
      // Redirect to login page after successful setup
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    } catch (error) {
      console.error('Setup error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Initial Setup
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Create your admin account to manage your portfolio
          </p>
        </div>
        
        <div className="bg-white px-6 py-8 shadow-md rounded-lg">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">
              {success}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label
                htmlFor="setupKey"
                className="block text-sm font-medium text-gray-700"
              >
                Setup Key (only needed if admin already exists)
              </label>
              <input
                id="setupKey"
                name="setupKey"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={setupKey}
                onChange={(e) => setSetupKey(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Create Admin Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
