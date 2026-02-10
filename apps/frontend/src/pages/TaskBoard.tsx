import { TaskHeader } from '@/components/tasks/taskHeader';
import { TaskColumn } from '@/components/tasks/taskColumn';
import { Separator } from '@/components/ui/separator';

export default function TaskBoard() {
  return (
    <div className="flex">
      <main className="flex-1 p-6">
        <TaskHeader />
        <Separator className="mb-4" />
        <div className="flex gap-4 overflow-x-auto">
          <TaskColumn title="To Do" status="TODO" />
          <TaskColumn title="In Progress" status="IN_PROGRESS" />
          <TaskColumn title="Review" status="IN_REVIEW" />
          <TaskColumn title="Blocked" status="BLOCKED" />
          <TaskColumn title="Done" status="DONE" />
        </div>
      </main>
    </div>
  );
}
