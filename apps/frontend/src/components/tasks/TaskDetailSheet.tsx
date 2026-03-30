import { useState } from 'react';
import { Task, TaskDifficulty, Status } from '@/types/task';
import { type Member } from '@/services/memberService';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CalendarDays, RefreshCw, Pencil, Trash2, X, Check, User, Zap } from 'lucide-react';

const difficultyColor: Record<string, string> = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

const statusLabel: Record<Status, string> = {
  [Status.TODO]: 'To Do',
  [Status.IN_PROGRESS]: 'In Progress',
  [Status.IN_REVIEW]: 'In Review',
  [Status.BLOCKED]: 'Blocked',
  [Status.DONE]: 'Done',
};

interface Props {
  task: Task | null;
  members: Member[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updated: Task) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function TaskDetailSheet({ task, members, open, onOpenChange, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [draft, setDraft] = useState<Partial<Task>>({});
  const [saving, setSaving] = useState(false);

  if (!task) return null;

  const assignee = members.find((m) => m.id === task.assigneeId);

  function startEdit() {
    setDraft({
      taskName: task!.taskName,
      taskDesc: task!.taskDesc,
      difficulty: task!.difficulty,
      effort: task!.effort,
    });
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setDraft({});
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onUpdate({ ...task!, ...draft });
      setEditing(false);
      setDraft({});
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await onDelete(task!.id);
      onOpenChange(false);
    } finally {
      setSaving(false);
      setConfirmDelete(false);
    }
  }

  function handleOpenChange(val: boolean) {
    if (!val) {
      setEditing(false);
      setDraft({});
      setConfirmDelete(false);
    }
    onOpenChange(val);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col gap-0 p-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4">
          {editing ? (
            <Input
              value={draft.taskName ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, taskName: e.target.value }))}
              className="text-base font-semibold"
              placeholder="Task name"
            />
          ) : (
            <SheetTitle className="text-base leading-snug pr-6">{task.taskName}</SheetTitle>
          )}
        </SheetHeader>

        <Separator />

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Status */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-20 shrink-0">Status</span>
            <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-medium">
              {statusLabel[task.status]}
            </span>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Description</span>
            {editing ? (
              <Textarea
                value={draft.taskDesc ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, taskDesc: e.target.value }))}
                className="text-sm resize-none min-h-28"
                placeholder="Task description"
              />
            ) : (
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {task.taskDesc || <span className="text-muted-foreground italic">No description</span>}
              </p>
            )}
          </div>

          <Separator />

          {/* Difficulty */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-20 shrink-0">Difficulty</span>
            {editing ? (
              <select
                value={draft.difficulty ?? ''}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, difficulty: e.target.value as TaskDifficulty }))
                }
                className="rounded-md border bg-background px-3 py-1.5 text-sm"
              >
                {Object.values(TaskDifficulty).map((d) => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            ) : (
              <span
                className={cn(
                  'rounded-full px-3 py-0.5 text-xs font-medium capitalize',
                  task.difficulty
                    ? difficultyColor[task.difficulty]
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {task.difficulty ?? '—'}
              </span>
            )}
          </div>

          {/* Effort */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-20 shrink-0">Effort</span>
            {editing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={draft.effort ?? 0}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, effort: Number(e.target.value) }))
                  }
                  className="w-20 text-sm"
                />
                <span className="text-xs text-muted-foreground">pts</span>
              </div>
            ) : (
              <span className="flex items-center gap-1.5 text-sm">
                <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                {task.effort} pts
              </span>
            )}
          </div>

          <Separator />

          {/* Assignee */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-20 shrink-0">Assigned to</span>
            {editing ? (
              <select
                value={draft.assigneeId ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, assigneeId: e.target.value || null }))}
                className="rounded-md border bg-background px-3 py-1.5 text-sm flex-1"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} (cap: {m.availableCapacity})</option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs">
                    {assignee ? assignee.name[0].toUpperCase() : <User className="h-3.5 w-3.5" />}
                  </AvatarFallback>
                </Avatar>
                <span className={cn('text-sm', !assignee && 'text-muted-foreground italic')}>
                  {assignee ? assignee.name : 'Unassigned'}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* Dates */}
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              Created{' '}
              {new Date(task.createdAt).toLocaleDateString(undefined, {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5 shrink-0" />
              Updated{' '}
              {new Date(task.updatedAt).toLocaleDateString(undefined, {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
          </div>
        </div>

        <Separator />

        {/* Footer actions */}
        <SheetFooter className="px-6 py-4 flex-row justify-between">
          {confirmDelete ? (
            <div className="flex items-center gap-2 w-full">
              <span className="text-sm text-destructive flex-1">Delete this task?</span>
              <Button size="sm" variant="destructive" disabled={saving} onClick={handleDelete}>
                <Check className="h-3.5 w-3.5 mr-1" /> Confirm
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : editing ? (
            <div className="flex gap-2 w-full justify-end">
              <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
              <Button size="sm" disabled={saving || !draft.taskName?.trim()} onClick={handleSave}>
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 w-full justify-end">
              <Button size="sm" variant="outline" onClick={startEdit}>
                <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive border-destructive/40 hover:bg-destructive/10"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
