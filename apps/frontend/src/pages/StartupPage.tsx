import { TaskHeader } from '@/components/tasks/taskHeader';
import { Separator } from '@/components/ui/separator';

export default function StartupPage() {
  return (
    <div className="flex">
      <main className="flex-1 p-6">
        <TaskHeader />
        <Separator className="mb-4" />
        <div className="flex gap-4 overflow-x-auto">
           NOTHING
        </div>
      </main>
    </div>
  );
}
