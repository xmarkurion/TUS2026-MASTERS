import { TaskHeader } from '@/components/tasks/taskHeader';
import { TaskColumn } from '@/components/tasks/taskColumn';
import { TaskCardContent } from '@/components/tasks/taskCard';
import { TaskDetailSheet } from '@/components/tasks/TaskDetailSheet';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService, type NewTaskInput } from '@/services/taskService';
import { memberService, type Member } from '@/services/memberService';
import { Task, Status, TaskDifficulty } from '@/types/task';

const COLUMNS: { title: string; status: Status }[] = [
  { title: 'To Do', status: Status.TODO },
  { title: 'In Progress', status: Status.IN_PROGRESS },
  { title: 'Review', status: Status.IN_REVIEW },
  { title: 'Blocked', status: Status.BLOCKED },
  { title: 'Done', status: Status.DONE },
];

const EMPTY_TASK: NewTaskInput = {
  taskName: '',
  taskDesc: '',
  difficulty: TaskDifficulty.MEDIUM,
  effort: 1,
  status: Status.TODO,
  assigneeId: null,
};

export default function TaskBoard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [addForm, setAddForm] = useState<NewTaskInput>(EMPTY_TASK);
  const [addSaving, setAddSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [data, memberData] = await Promise.all([
          taskService.findAllTasks(),
          memberService.findAllMembers(),
        ]);
        setTasks(data);
        setDisplayedTasks(data);
        setMembers(memberData);
      } catch (err) {
        setError((err as Error).message || 'Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Debounced search
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setDisplayedTasks(tasks);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await taskService.findByName(trimmed);
        setDisplayedTasks(results);
      } catch {
        // fallback to client-side filter on API error
        setDisplayedTasks(
          tasks.filter((t) =>
            t.taskName.toLowerCase().includes(trimmed.toLowerCase()),
          ),
        );
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, tasks]);

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

    const applyStatus = (prev: Task[]) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));

    setTasks(applyStatus);
    setDisplayedTasks(applyStatus);

    taskService.updateTask(taskId, { ...task, status: newStatus }).catch(() => {
      const revert = (prev: Task[]) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: previousStatus } : t));
      setTasks(revert);
      setDisplayedTasks(revert);
    });

    // Optimistically update displayed capacity (computed: totalCapacity - active task efforts)
    const enteringDone = newStatus === Status.DONE && previousStatus !== Status.DONE;
    const leavingDone = previousStatus === Status.DONE && newStatus !== Status.DONE;

    if ((enteringDone || leavingDone) && task.assigneeId) {
      const delta = enteringDone ? task.effort : -task.effort;
      setMembers((prev) =>
        prev.map((m) =>
          m.id === task.assigneeId
            ? { ...m, availableCapacity: m.availableCapacity + delta }
            : m,
        ),
      );
    }
  }

  function handleCardClick(task: Task) {
    setSelectedTask(task);
    setSheetOpen(true);
  }

  const handleTaskUpdate = useCallback(async (updated: Task) => {
    await taskService.updateTask(updated.id, updated);
    const apply = (prev: Task[]) =>
      prev.map((t) => (t.id === updated.id ? updated : t));
    setTasks(apply);
    setDisplayedTasks(apply);
    setSelectedTask(updated);
  }, []);

  const handleTaskDelete = useCallback(async (taskId: string) => {
    await taskService.deleteTask(taskId);
    const remove = (prev: Task[]) => prev.filter((t) => t.id !== taskId);
    setTasks(remove);
    setDisplayedTasks(remove);
  }, []);

  async function handleAddTask() {
    if (!addForm.taskName.trim()) return;
    setAddSaving(true);
    try {
      const created = await taskService.createTask(addForm);
      setTasks((prev) => [...prev, created]);
      setDisplayedTasks((prev) => [...prev, created]);
      setAddForm(EMPTY_TASK);
      setAddSheetOpen(false);
    } finally {
      setAddSaving(false);
    }
  }

  async function handleAssignAll() {
    setAssigning(true);
    try {
      const results = await taskService.assignAll();
      navigate('/pages/assignreview', { state: { results, members } });
    } finally {
      setAssigning(false);
    }
  }

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="flex">
      <main className="flex-1 p-6">
        <TaskHeader
          onSearch={setSearchQuery}
          onAddTask={() => setAddSheetOpen(true)}
          onAssignAll={handleAssignAll}
          assigning={assigning}
        />
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
                taskArray={displayedTasks.filter((t) => t.status === col.status)}
                members={members}
                onCardClick={handleCardClick}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-2 opacity-95 shadow-xl">
                <TaskCardContent task={activeTask} members={members} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      <TaskDetailSheet
        task={selectedTask}
        members={members}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />

      {/* Add Task sheet */}
      <Sheet open={addSheetOpen} onOpenChange={(v) => { setAddSheetOpen(v); if (!v) setAddForm(EMPTY_TASK); }}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col gap-0 p-0">
          <SheetHeader className="px-6 pt-6 pb-4">
            <SheetTitle>Add Task</SheetTitle>
          </SheetHeader>
          <Separator />
          <div className="flex flex-col gap-5 px-6 py-5 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">Name *</label>
              <Input
                value={addForm.taskName}
                onChange={(e) => setAddForm((f) => ({ ...f, taskName: e.target.value }))}
                placeholder="Task name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">Description</label>
              <Textarea
                value={addForm.taskDesc}
                onChange={(e) => setAddForm((f) => ({ ...f, taskDesc: e.target.value }))}
                placeholder="What needs to be done?"
                className="resize-none min-h-24 text-sm"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs text-muted-foreground">Difficulty</label>
                <select
                  value={addForm.difficulty}
                  onChange={(e) => setAddForm((f) => ({ ...f, difficulty: e.target.value as TaskDifficulty }))}
                  className="rounded-md border bg-background px-3 py-2 text-sm"
                >
                  {Object.values(TaskDifficulty).map((d) => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5 w-28">
                <label className="text-xs text-muted-foreground">Effort (pts)</label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={addForm.effort}
                  onChange={(e) => setAddForm((f) => ({ ...f, effort: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>
          <Separator />
          <SheetFooter className="px-6 py-4 flex-row justify-end gap-2">
            <Button variant="ghost" onClick={() => setAddSheetOpen(false)}>Cancel</Button>
            <Button disabled={addSaving || !addForm.taskName.trim()} onClick={handleAddTask}>
              {addSaving ? 'Creating…' : 'Create Task'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
