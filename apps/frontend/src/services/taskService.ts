import { Task, Status, TaskDifficulty } from '@/types/task';

export interface AssignmentResult {
  taskId: string;
  taskName: string;
  assigneeId: string;
  assigneeName: string;
  reasonForAssignment: string;
  overCapacity: boolean;
}

export interface NewTaskInput {
  taskName: string;
  taskDesc: string;
  difficulty: TaskDifficulty;
  effort: number;
  status: Status;
  assigneeId: string | null;
}

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

  createTask: async (task: NewTaskInput): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/addTask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return await response.json();
  },

  findByName: async (name: string): Promise<Task[]> => {
    const response = await fetch(
      `${API_BASE_URL}/tasks/findByName?name=${encodeURIComponent(name)}`,
    );
    if (!response.ok) throw new Error('Failed to search tasks');
    return await response.json();
  },

  assignTask: async (taskId: string): Promise<{ taskId: string; assigneeId: string; assigneeName: string }> => {
    const response = await fetch(`${API_BASE_URL}/agents/tasks/assign/${taskId}`, {
      method: 'POST',
    });
    if (response.status === 409) throw new Error('No team member has sufficient capacity');
    if (!response.ok) throw new Error('Failed to assign task');
    return await response.json();
  },

  assignAll: async (): Promise<AssignmentResult[]> => {
    const response = await fetch(`${API_BASE_URL}/agents/tasks/assign/stream`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Assignment stream failed');

    const results: AssignmentResult[] = [];
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      let eventType = '';
      for (const line of lines) {
        if (line.startsWith('event:')) {
          eventType = line.slice(6).trim();
        } else if (line.startsWith('data:')) {
          const data = line.slice(5).trim();
          if (eventType === 'batch') {
            try { results.push(...JSON.parse(data)); } catch { /* ignore */ }
          } else if (eventType === 'done' || eventType === 'warning') {
            reader.cancel();
            return results;
          }
          eventType = '';
        }
      }
    }
    return results;
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

  deleteAllTasks: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tasks/deleteAll`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete all tasks');
  },

  deleteTask: async (taskId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tasks/delete/${taskId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
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
