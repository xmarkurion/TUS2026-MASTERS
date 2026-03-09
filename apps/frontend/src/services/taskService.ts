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
      // Check if the response is successful if not throw an error
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
    //   console.log('API Response:', await response.clone().json());
      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },
};
