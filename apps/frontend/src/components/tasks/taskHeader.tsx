import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, UserCheck } from 'lucide-react';

export function TaskHeader({
  name = 'Task Board',
  onSearch,
  onAddTask,
  onAssignAll,
  assigning,
}: {
  name?: string;
  onSearch?: (query: string) => void;
  onAddTask?: () => void;
  onAssignAll?: () => void;
  assigning?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
      <h1 className="text-2xl font-bold">{name}</h1>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
        {onAssignAll && (
          <Button variant="outline" disabled={assigning} onClick={onAssignAll}>
            <UserCheck className="h-4 w-4 mr-1.5" />
            {assigning ? 'Assigning…' : 'Auto Assign'}
          </Button>
        )}
        {onAddTask && (
          <Button onClick={onAddTask}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Task
          </Button>
        )}
      </div>
    </div>
  );
}
