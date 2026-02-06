/**
 * Task detail page.
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { isAuthenticated, getCurrentUserId } from '@/lib/auth';
import { apiClient } from '@/lib/api-client';
import { Task } from '@/lib/types';
import AppLayout from '@/components/layout/AppLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    // Check authentication status after component mounts (client-side only)
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    } else {
      setAuthCheckComplete(true);
      loadTask();
    }
  }, [taskId, router]);

  const loadTask = async () => {
    const userId = getCurrentUserId();
    if (!userId || !taskId) return;

    setIsLoading(true);
    setError('');
    try {
      const taskData = await apiClient.getTask(userId, taskId);
      setTask(taskData);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Task not found');
      } else if (err.response?.status === 403) {
        setError('Access denied');
      } else {
        setError('Failed to load task. Please try again.');
      }
      console.error('Failed to load task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Show nothing while checking authentication status to prevent hydration mismatch
  if (!authCheckComplete) {
    return null;
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (error || !task) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error || 'Task not found'}</p>
          </div>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => router.push('/tasks')}>
              Back to Tasks
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <a
            href="/tasks"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            ← Back to Tasks
          </a>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3 flex-1">
              <div className={`mt-1 ${task.completed ? 'text-green-600' : 'text-gray-400'}`}>
                {task.completed ? (
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h1 className={`text-2xl font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </h1>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>Created {new Date(task.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Updated {new Date(task.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <a
              href={`/tasks/${task.id}/edit`}
              className="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Edit
            </a>
          </div>

          {task.description && (
            <div className="mt-6">
              <h2 className="text-sm font-medium text-gray-700 mb-2">Description</h2>
              <p className={`text-gray-900 whitespace-pre-wrap ${task.completed ? 'text-gray-500' : ''}`}>
                {task.description}
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {task.completed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Active
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Task ID</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{task.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
