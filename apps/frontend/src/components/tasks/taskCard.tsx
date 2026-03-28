import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Task } from '@/types/task';
import { UserMock } from '@/lib/testData';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

export function TaskCardContent({ task }: { task: Task }) {
  const assignee = UserMock.find((u) => u._id === task.assigneeId);

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-sm">{task.taskName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <p className="text-muted-foreground">{task.taskDesc}</p>
        <div className="flex justify-between items-center">
          {task.difficulty && <Badge>{task.difficulty}</Badge>}
        </div>
        {assignee && (
          <div className="flex justify-between items-center gap-2">
            <span className="text-muted-foreground">Effort: {task.effort}</span>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>{assignee.personName[0]}</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">{assignee.personName}</span>
            </div>
          </div>
        )}
        <div>
          <span className="flex justify-between text-muted-foreground text-xs">
            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
            <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function TaskCard({ task }: { task: Task }) {
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
    >
      <TaskCardContent task={task} />
    </div>
  );
}
