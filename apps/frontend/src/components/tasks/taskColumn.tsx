import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskCard } from './taskCard';
import { TaskStatus } from '@/lib/types';
import { tasks } from '@/lib/testData';

export function TaskColumn({
  title,
  status,
}: {
  title: string;
  status: TaskStatus;
}) {
  const columnTasks = tasks.filter((t) => t.status === status);

  return (
    <div className="w-72 bg-muted/40 rounded-xl p-3">
      <h3 className="text-sm font-semibold mb-3 text-center">{title}</h3>
      <ScrollArea className="h-[70vh]">
        <div className="flex flex-col gap-3">
          {columnTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
