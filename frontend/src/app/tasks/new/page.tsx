/**
 * Task creation page.
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import AppLayout from '@/components/layout/AppLayout';
import TaskForm from '@/components/tasks/TaskForm';

export default function NewTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status after component mounts (client-side only)
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  // Show nothing while checking authentication status to prevent hydration mismatch
  if (loading || !isAuthenticated()) {
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <TaskForm mode="create" />
        </div>
      </div>
    </AppLayout>
  );
}
