import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskCard } from './taskCard';
import { Task, Status } from '@/types/task';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

export function TaskColumn({
  title,
  status,
  taskArray,
}: {
  title: string;
  status: Status;
  taskArray: Task[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'w-72 rounded-xl p-3 transition-colors',
        isOver ? 'bg-muted/70 ring-2 ring-primary' : 'bg-muted/40',
      )}
    >
      <h3 className="text-sm font-semibold mb-3 text-center">{title}</h3>
      <ScrollArea className="h-[70vh]">
        <div className="flex flex-col gap-3 pr-1">
          {taskArray.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
