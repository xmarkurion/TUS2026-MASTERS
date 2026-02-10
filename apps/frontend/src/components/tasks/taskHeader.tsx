import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';

export function TaskHeader() {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold">Task Manager</h1>
      <div className="flex items-center gap-2">
        <Input placeholder="Search tasks..." className="w-64" />
        <Button variant="outline" size="icon">
          <Filter size={16} />
        </Button>
        <Button>
          <Plus size={16} /> New Task
        </Button>
      </div>
    </div>
  );
}
