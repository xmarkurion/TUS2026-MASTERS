import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Task } from '@/types/task';
import { type Member } from '@/services/memberService';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { CalendarDays, RefreshCw, User, Zap } from 'lucide-react';

const difficultyColor: Record<string, string> = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

export function TaskCardContent({
  task,
  members = [],
}: {
  task: Task;
  members?: Member[];
}) {
  const assignee = members.find((m) => m.id === task.assigneeId);

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold leading-snug">
          {task.taskName}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 text-xs">
        {/* Description */}
        {task.taskDesc && (
          <p className="text-muted-foreground leading-relaxed line-clamp-2">
            {task.taskDesc}
          </p>
        )}

        {/* Difficulty + Effort */}
        <div className="flex items-center gap-2 flex-wrap">
          {task.difficulty && (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[11px] font-medium capitalize',
                difficultyColor[task.difficulty] ?? 'bg-muted text-muted-foreground',
              )}
            >
              {task.difficulty}
            </span>
          )}
          {task.effort != null && (
            <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              <Zap className="h-2.5 w-2.5" />
              {task.effort} pts effort
            </span>
          )}
        </div>

        {/* Assignee */}
        <div className="flex items-center gap-2 border-t pt-2">
          <Avatar className="h-6 w-6 shrink-0">
            <AvatarFallback className="text-[10px]">
              {assignee ? assignee.name[0].toUpperCase() : <User className="h-3 w-3" />}
            </AvatarFallback>
          </Avatar>
          <span className={cn('truncate', assignee ? 'text-foreground font-medium' : 'text-muted-foreground italic')}>
            {assignee ? assignee.name : 'Unassigned'}
          </span>
        </div>

        {/* Dates */}
        <div className="flex flex-col gap-1 border-t pt-2 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3 w-3 shrink-0" />
            Created {new Date(task.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1.5">
            <RefreshCw className="h-3 w-3 shrink-0" />
            Updated {new Date(task.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function TaskCard({
  task,
  members,
  onClick,
}: {
  task: Task;
  members: Member[];
  onClick: (task: Task) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-40',
      )}
      onClick={() => !isDragging && onClick(task)}
    >
      <TaskCardContent task={task} members={members} />
    </div>
  );
}
