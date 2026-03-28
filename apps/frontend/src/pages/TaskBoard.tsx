import { TaskHeader } from '@/components/tasks/taskHeader';
import { TaskColumn } from '@/components/tasks/taskColumn';
import { TaskCardContent } from '@/components/tasks/taskCard';
import { Separator } from '@/components/ui/separator';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState, useEffect } from 'react';
import { taskService } from '@/services/taskService';
import { memberService, type Member } from '@/services/memberService';
import { Task, Status } from '@/types/task';

const COLUMNS: { title: string; status: Status }[] = [
  { title: 'To Do', status: Status.TODO },
  { title: 'In Progress', status: Status.IN_PROGRESS },
  { title: 'Review', status: Status.IN_REVIEW },
  { title: 'Blocked', status: Status.BLOCKED },
  { title: 'Done', status: Status.DONE },
];

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const [data, memberData] = await Promise.all([
          taskService.findAllTasks(),
          memberService.findAllMembers(),
        ]);
        setTasks(data);
        setMembers(memberData);
      } catch (err) {
        setError((err as Error).message || 'Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Status;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    const previousStatus = task.status;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    );

    // Persist status to backend, revert on failure
    taskService.updateTask(taskId, { ...task, status: newStatus }).catch(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: previousStatus } : t,
        ),
      );
    });

    // Capacity only changes when crossing the Done boundary
    const enteringDone = newStatus === Status.DONE && previousStatus !== Status.DONE;
    const leavingDone = previousStatus === Status.DONE && newStatus !== Status.DONE;

    if ((enteringDone || leavingDone) && task.assigneeId) {
      const member = members.find((m) => m.id === task.assigneeId);
      if (member) {
        const newCapacity = enteringDone
          ? Math.min(10, member.availableCapacity + task.effort)
          : Math.max(0, member.availableCapacity - task.effort);

        setMembers((prev) =>
          prev.map((m) =>
            m.id === task.assigneeId ? { ...m, availableCapacity: newCapacity } : m,
          ),
        );
        memberService.updateCapacity(task.assigneeId, newCapacity).catch(() => {
          setMembers((prev) =>
            prev.map((m) =>
              m.id === task.assigneeId
                ? { ...m, availableCapacity: member.availableCapacity }
                : m,
            ),
          );
        });
      }
    }
  }

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="flex">
      <main className="flex-1 p-6">
        <TaskHeader />
        <Separator className="mb-4" />
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map((col) => (
              <TaskColumn
                key={col.status}
                title={col.title}
                status={col.status}
                taskArray={tasks.filter((t) => t.status === col.status)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-2 opacity-95 shadow-xl">
                <TaskCardContent task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}
