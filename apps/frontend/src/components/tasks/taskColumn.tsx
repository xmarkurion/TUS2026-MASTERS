import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskCard } from './taskCard';
import { Task, Status } from '@/types/task';
import { type Member } from '@/services/memberService';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

export function TaskColumn({
  title,
  status,
  taskArray,
  members,
  onCardClick,
}: {
  title: string;
  status: Status;
  taskArray: Task[];
  members: Member[];
  onCardClick: (task: Task) => void;
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
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
          {taskArray.length}
        </span>
      </div>
      <ScrollArea className="h-[70vh]">
        <div className="flex flex-col gap-3 pr-1">
          {taskArray.map((task) => (
            <TaskCard key={task.id} task={task} members={members} onClick={onCardClick} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
