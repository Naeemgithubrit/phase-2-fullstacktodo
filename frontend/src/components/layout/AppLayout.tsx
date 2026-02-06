/**
 * Main application layout with header and user menu.
 */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { isAuthenticated } from '@/lib/auth';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    apiClient.logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Todo App
              </h1>
            </div>
            {authenticated && (
              <div className="flex items-center space-x-4">
                <a
                  href="/tasks"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  My Tasks
                </a>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
