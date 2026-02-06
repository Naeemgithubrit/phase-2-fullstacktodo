/**
 * Task form component for create and edit operations.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { apiClient } from '@/lib/api-client';
import { getCurrentUserId } from '@/lib/auth';
import { Task } from '@/lib/types';

interface TaskFormProps {
  mode: 'create' | 'edit';
  taskId?: string;
}

export default function TaskForm({ mode, taskId }: TaskFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTask, setIsLoadingTask] = useState(mode === 'edit');

  useEffect(() => {
    if (mode === 'edit' && taskId) {
      loadTask();
    }
  }, [mode, taskId]);

  const loadTask = async () => {
    const userId = getCurrentUserId();
    if (!userId || !taskId) return;

    setIsLoadingTask(true);
    try {
      const task = await apiClient.getTask(userId, taskId);
      setTitle(task.title);
      setDescription(task.description || '');
    } catch (err: any) {
      setError('Failed to load task. Please try again.');
      console.error('Failed to load task:', err);
    } finally {
      setIsLoadingTask(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const userId = getCurrentUserId();
    if (!userId) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'create') {
        await apiClient.createTask(userId, { title, description: description || undefined });
        router.push('/tasks');
      } else if (taskId) {
        await apiClient.updateTask(userId, taskId, { title, description: description || undefined });
        router.push(`/tasks/${taskId}`);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error ||
        err.response?.data?.detail ||
        'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingTask) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          maxLength={200}
          disabled={isLoading}
          helperText="1-200 characters"
        />
      </div>

      <div>
        <Textarea
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          maxLength={1000}
          disabled={isLoading}
          helperText="0-1000 characters"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {mode === 'create' ? 'Create Task' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
