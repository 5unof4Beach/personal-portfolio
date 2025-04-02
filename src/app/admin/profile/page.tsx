'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { fetchData, putData } from '@/lib/api';

interface ProfileData {
  name: string;
  title: string;
  about: string;
  skills: string[];
  contact: {
    email: string;
    phone: string;
  };
  social: {
    linkedin: string;
    github: string;
    twitter: string;
    website: string;
  };
}

export default function ProfileEditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    title: '',
    about: '',
    skills: [],
    contact: {
      email: '',
      phone: '',
    },
    social: {
      linkedin: '',
      github: '',
      twitter: '',
      website: '',
    },
  });

  // New skill input state
  const [newSkill, setNewSkill] = useState('');

  // Fetch profile data on page load
  useEffect(() => {
    async function loadProfile() {
      if (status === 'loading') return;
      
      if (status === 'unauthenticated') {
        router.push('/admin/login');
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await fetchData<ProfileData>('/api/profile');
        setProfileData(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProfile();
  }, [status, router]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setProfileData({
        ...profileData,
        [section]: {
          ...profileData[section as keyof ProfileData] as any,
          [field]: value,
        },
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: value,
      });
    }
  };

  // Add a new skill
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    setProfileData({
      ...profileData,
      skills: [...profileData.skills, newSkill.trim()],
    });
    
    setNewSkill('');
  };

  // Remove a skill
  const handleRemoveSkill = (index: number) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((_, i) => i !== index),
    });
  };

  // Save profile data
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');
      
      await putData('/api/profile', profileData);
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <button
              onClick={() => router.push('/admin')}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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

        <form onSubmit={handleSave} className="space-y-8">
          {/* Basic Information */}
          <div className="rounded-md bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Basic Information</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={profileData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="rounded-md bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-medium text-gray-900">About</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                About Me
              </label>
              <textarea
                name="about"
                value={profileData.about}
                onChange={handleInputChange}
                rows={6}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="rounded-md bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Skills</h2>
            
            <div className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="block w-full rounded-l-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="rounded-r-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center rounded-full bg-indigo-100 px-3 py-1"
                >
                  <span className="mr-1 text-sm text-indigo-800">{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-md bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Contact Information</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="contact.email"
                  value={profileData.contact.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  name="contact.phone"
                  value={profileData.contact.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="rounded-md bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Social Links</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="social.linkedin"
                  value={profileData.social.linkedin}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  GitHub
                </label>
                <input
                  type="url"
                  name="social.github"
                  value={profileData.social.github}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Twitter
                </label>
                <input
                  type="url"
                  name="social.twitter"
                  value={profileData.social.twitter}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  name="social.website"
                  value={profileData.social.website}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-md bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
