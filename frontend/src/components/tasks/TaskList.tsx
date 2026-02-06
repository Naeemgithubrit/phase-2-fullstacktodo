/**
 * Task list container component.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { getCurrentUserId } from '@/lib/auth';
import TaskItem from './TaskItem';
import LoadingSpinner from '../ui/LoadingSpinner';
import Modal from '../ui/Modal';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const loadTasks = async () => {
    const userId = getCurrentUserId();
    if (!userId) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.getTasks(userId);
      setTasks(response.tasks);
    } catch (err: any) {
      setError('Failed to load tasks. Please try again.');
      console.error('Failed to load tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    const userId = getCurrentUserId();
    if (!userId) return;

    try {
      await apiClient.deleteTask(userId, taskToDelete);
      await loadTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task. Please try again.');
    } finally {
      setTaskToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first task.</p>
        <div className="mt-6">
          <a
            href="/tasks/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create Task
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdate={loadTasks}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
