import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Task, TaskDifficulty } from '@/types/task';
import { taskService } from '@/services/taskService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Check, Pencil, Trash2, X, Zap } from 'lucide-react';

type ReviewState = 'pending' | 'approved' | 'rejected';

interface ReviewTask {
  task: Task;
  state: ReviewState;
  editing: boolean;
  draft: { taskName: string; taskDesc: string; difficulty: TaskDifficulty; effort: number };
}

const difficultyColor: Record<string, string> = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

export default function TaskReview() {
  const location = useLocation();
  const navigate = useNavigate();
  const incoming: Task[] = location.state?.tasks ?? [];

  const [items, setItems] = useState<ReviewTask[]>(
    incoming.map((t) => ({
      task: t,
      state: 'pending',
      editing: false,
      draft: {
        taskName: t.taskName,
        taskDesc: t.taskDesc,
        difficulty: t.difficulty,
        effort: t.effort,
      },
    })),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (incoming.length === 0) {
    navigate('/pages/taskcreation');
    return null;
  }

  // --- actions ---

  function approve(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.task.id === id ? { ...i, state: 'approved' } : i)),
    );
  }

  function reject(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.task.id === id ? { ...i, state: 'rejected', editing: false } : i)),
    );
  }

  function startEdit(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.task.id === id ? { ...i, editing: true } : i)),
    );
  }

  function cancelEdit(id: string) {
    setItems((prev) =>
      prev.map((i) =>
        i.task.id === id
          ? {
              ...i,
              editing: false,
              draft: {
                taskName: i.task.taskName,
                taskDesc: i.task.taskDesc,
                difficulty: i.task.difficulty,
                effort: i.task.effort,
              },
            }
          : i,
      ),
    );
  }

  function updateDraft(id: string, field: string, value: string | number) {
    setItems((prev) =>
      prev.map((i) =>
        i.task.id === id ? { ...i, draft: { ...i.draft, [field]: value } } : i,
      ),
    );
  }

  function saveEdit(id: string) {
    setItems((prev) =>
      prev.map((i) =>
        i.task.id === id
          ? {
              ...i,
              editing: false,
              state: 'approved',
              task: { ...i.task, ...i.draft },
            }
          : i,
      ),
    );
  }

  function approveAll() {
    setItems((prev) =>
      prev.map((i) =>
        i.state === 'pending' ? { ...i, state: 'approved' } : i,
      ),
    );
  }

  function rejectAll() {
    setItems((prev) =>
      prev.map((i) =>
        i.state === 'pending' ? { ...i, state: 'rejected', editing: false } : i,
      ),
    );
  }

  // --- confirm ---

  async function handleConfirm() {
    setSaving(true);
    setError(null);

    const toDelete = items.filter((i) => i.state === 'rejected');
    const toUpdate = items.filter(
      (i) => i.state === 'approved',
    );

    try {
      await Promise.all([
        ...toDelete.map((i) => taskService.deleteTask(i.task.id)),
        ...toUpdate.map((i) => taskService.updateTask(i.task.id, i.task)),
      ]);
      navigate('/pages/taskboard');
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const approved = items.filter((i) => i.state === 'approved').length;
  const rejected = items.filter((i) => i.state === 'rejected').length;
  const pending = items.filter((i) => i.state === 'pending').length;

  return (
    <div className="flex flex-1 flex-col px-6 py-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight mb-1">Review Generated Tasks</h1>
        <p className="text-muted-foreground text-sm">
          Approve, edit, or reject each task before they land on your board.
        </p>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-4 text-sm mb-4 flex-wrap">
        <span className="text-muted-foreground">{items.length} tasks total</span>
        <span className="text-green-600 dark:text-green-400 font-medium">{approved} approved</span>
        <span className="text-red-600 dark:text-red-400 font-medium">{rejected} rejected</span>
        <span className="text-muted-foreground">{pending} pending</span>
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="outline" onClick={approveAll} disabled={pending === 0}>
            Approve all
          </Button>
          <Button size="sm" variant="outline" onClick={rejectAll} disabled={pending === 0}>
            Reject all
          </Button>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Task list */}
      <div className="flex flex-col gap-4 mb-8">
        {items.map((item) => (
          <div
            key={item.task.id}
            className={cn(
              'rounded-xl border p-4 transition-colors',
              item.state === 'approved' && 'border-green-500/50 bg-green-50/40 dark:bg-green-900/10',
              item.state === 'rejected' && 'border-red-500/30 bg-red-50/40 dark:bg-red-900/10 opacity-50',
              item.state === 'pending' && 'bg-card',
            )}
          >
            {item.editing ? (
              /* ── Edit mode ── */
              <div className="flex flex-col gap-3">
                <Input
                  value={item.draft.taskName}
                  onChange={(e) => updateDraft(item.task.id, 'taskName', e.target.value)}
                  className="font-semibold"
                  placeholder="Task name"
                />
                <Textarea
                  value={item.draft.taskDesc}
                  onChange={(e) => updateDraft(item.task.id, 'taskDesc', e.target.value)}
                  className="text-sm resize-none min-h-20"
                  placeholder="Description"
                />
                <div className="flex gap-3 flex-wrap items-center">
                  <select
                    value={item.draft.difficulty}
                    onChange={(e) =>
                      updateDraft(item.task.id, 'difficulty', e.target.value)
                    }
                    className="rounded-md border bg-background px-3 py-1.5 text-sm"
                  >
                    {Object.values(TaskDifficulty).map((d) => (
                      <option key={d} value={d}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={item.draft.effort}
                      onChange={(e) =>
                        updateDraft(item.task.id, 'effort', Number(e.target.value))
                      }
                      className="w-20 text-sm"
                    />
                    <span className="text-xs text-muted-foreground">pts</span>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button size="sm" onClick={() => saveEdit(item.task.id)}>
                      <Check className="h-3.5 w-3.5 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => cancelEdit(item.task.id)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* ── View mode ── */
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-1">{item.task.taskName}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                    {item.task.taskDesc}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.task.difficulty && (
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[11px] font-medium capitalize',
                          difficultyColor[item.task.difficulty],
                        )}
                      >
                        {item.task.difficulty}
                      </span>
                    )}
                    <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      <Zap className="h-2.5 w-2.5" />
                      {item.task.effort} pts
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {item.state !== 'rejected' && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.state === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-500/50 hover:bg-green-50 dark:hover:bg-green-900/20"
                        onClick={() => approve(item.task.id)}
                      >
                        <Check className="h-3.5 w-3.5 mr-1" /> Approve
                      </Button>
                    )}
                    {item.state === 'approved' && (
                      <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium px-2">
                        <Check className="h-3.5 w-3.5" /> Approved
                      </span>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(item.task.id)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => reject(item.task.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {error && <p className="text-destructive text-sm mb-4">{error}</p>}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate('/pages/taskcreation')}>
          ← Back
        </Button>
        <Button
          size="lg"
          className="px-8"
          disabled={saving || approved === 0}
          onClick={handleConfirm}
        >
          {saving ? 'Saving…' : `Confirm ${approved} task${approved !== 1 ? 's' : ''} →`}
        </Button>
      </div>
    </div>
  );
}
