import { Task } from '@/types/task';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const taskService = {
  findAllTasks: async (): Promise<Task[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/findAllTasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  generateTasks: async (epicDescription: string): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/agents/tasks/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ epicDescription }),
    });
    if (!response.ok) {
      throw new Error('Failed to generate tasks');
    }
    return await response.json();
  },

  updateTask: async (taskId: string, task: Task): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/update/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    return await response.json();
  },
};
