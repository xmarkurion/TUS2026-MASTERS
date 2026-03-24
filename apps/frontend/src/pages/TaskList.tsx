import { TaskHeader } from '@/components/tasks/taskHeader';
import { TaskColumn } from '@/components/tasks/taskColumn';
import { Separator } from '@/components/ui/separator';
import { TaskCard } from '@/components/tasks/taskCard';

import { useState, useEffect } from 'react';
import { taskService } from '@/services/taskService';
import { Task } from '@/types/task';

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const data = await taskService.findAllTasks();
        setTasks(data);
      } catch (err) {
        setError(err.message || 'Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // 1. Handle Loading State
  if (loading) {
    return <div>Loading tasks...</div>;
  }

  // 2. Handle Error State
  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="flex">
      <main className="flex-1 p-6">
        <TaskHeader name="Task List" />
        <Separator className="mb-4" />
        <TaskList tasks={tasks} />
      </main>
    </div>
  );
}

const TaskList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  // 3. Handle Empty State
  if (tasks.length === 0) {
    return <div>No tasks found.</div>;
  }

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id} style={{ marginBottom: '1rem' }}>
          <TaskCard key={task.id} task={task} />
        </div>
      ))}
    </div>
  );
};
