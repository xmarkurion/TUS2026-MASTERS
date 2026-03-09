import { TaskHeader } from '@/components/tasks/taskHeader';
import { TaskColumn } from '@/components/tasks/taskColumn';
import { Separator } from '@/components/ui/separator';

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
        <TaskHeader />
        <Separator className="mb-4" />
        <div className="flex gap-4 overflow-x-auto">
          <TaskList tasks={tasks} />
          <TaskColumn
            title="To Do"
            status="TODO"
            taskArray={tasks.filter((task) => task.status === 'TODO')}
          />

          <TaskColumn title="In Progress" status="IN_PROGRESS" taskArray={tasks} />
          <TaskColumn title="Review" status="IN_REVIEW" taskArray={tasks.filter(task => task.status === 'IN_REVIEW')} />
          <TaskColumn title="Blocked" status="BLOCKED" taskArray={tasks.filter(task => task.status === 'BLOCKED')} />
          <TaskColumn title="Done" status="DONE" taskArray={tasks.filter(task => task.status === 'DONE')} />
        </div>
      </main>
    </div>
  );
}

const TaskList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  // 3. Handle Empty State
  if (tasks.length === 0) {
    return <div>No tasks found.</div>;
  }

  // return (
  //   <div>
  //     {tasks.map((task) => (
  //       <div key={task.id}>
  //         <h3>{task.taskName}</h3>
  //         <p>{task.taskDesc}</p>
  //         <p>Status: {task.status}</p>
  //       </div>
  //     ))}
  //   </div>
  // );
};
