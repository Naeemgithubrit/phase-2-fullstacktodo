/**
 * Individual task item component with checkbox and actions.
 */
'use client';

import React, { useState } from 'react';
import { Task } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { getCurrentUserId } from '@/lib/auth';

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
  onDelete: (taskId: string) => void;
}

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleCompletion = async () => {
    const userId = getCurrentUserId();
    if (!userId) return;

    setIsToggling(true);
    try {
      await apiClient.toggleCompletion(userId, task.id, !task.completed);
      onUpdate();
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-start space-x-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggleCompletion}
        disabled={isToggling}
        className="mt-1 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer disabled:opacity-50"
      />
      <div className="flex-1 min-w-0">
        <a
          href={`/tasks/${task.id}`}
          className={`block font-medium hover:text-primary-600 ${
            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}
        >
          {task.title}
        </a>
        {task.description && (
          <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
            {task.description}
          </p>
        )}
        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
          <span>Created {new Date(task.created_at).toLocaleDateString()}</span>
          <a
            href={`/tasks/${task.id}/edit`}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Edit
          </a>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
