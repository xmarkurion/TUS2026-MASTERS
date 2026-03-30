import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { type AssignmentResult, taskService } from '@/services/taskService';
import { memberService, type Member } from '@/services/memberService';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Check, X, MessageSquare, AlertTriangle, Loader2 } from 'lucide-react';

type ReviewState = 'pending' | 'approved' | 'rejected';

interface ReviewItem {
  result: AssignmentResult;
  state: ReviewState;
  overrideAssigneeId: string | null;
}

export default function AssignReview() {
  const navigate = useNavigate();

  const [items, setItems] = useState<ReviewItem[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [streaming, setStreaming] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const streamStarted = useRef(false);

  useEffect(() => {
    // Load members and start stream in parallel
    memberService.findAllMembers().then(setMembers).catch(() => {});

    if (streamStarted.current) return;
    streamStarted.current = true;

    taskService
      .assignAll((batch) => {
        setItems((prev) => [
          ...prev,
          ...batch.map((r) => ({ result: r, state: 'pending' as ReviewState, overrideAssigneeId: null })),
        ]);
      })
      .catch(() => setStreamError('Assignment stream failed. Please try again.'))
      .finally(() => setStreaming(false));
  }, []);

  function approve(taskId: string) {
    setItems((prev) => prev.map((i) => i.result.taskId === taskId ? { ...i, state: 'approved' } : i));
  }

  function reject(taskId: string) {
    setItems((prev) => prev.map((i) => i.result.taskId === taskId ? { ...i, state: 'rejected' } : i));
  }

  function changeAssignee(taskId: string, memberId: string) {
    setItems((prev) => prev.map((i) =>
      i.result.taskId === taskId
        ? { ...i, overrideAssigneeId: memberId, state: 'approved' }
        : i,
    ));
  }

  function approveAll() {
    setItems((prev) => prev.map((i) => i.state === 'pending' ? { ...i, state: 'approved' } : i));
  }

  function rejectAll() {
    setItems((prev) => prev.map((i) => i.state === 'pending' ? { ...i, state: 'rejected' } : i));
  }

  async function handleConfirm() {
    setSaving(true);
    setSaveError(null);
    try {
      const approved = items.filter((i) => i.state === 'approved');
      const tasks = await taskService.findAllTasks();
      await Promise.all(
        approved.map((item) => {
          const task = tasks.find((t) => t.id === item.result.taskId);
          if (!task) return Promise.resolve();
          const assigneeId = item.overrideAssigneeId ?? item.result.assigneeId;
          return taskService.updateTask(task.id, { ...task, assigneeId });
        }),
      );
      navigate('/pages/taskboard');
    } catch {
      setSaveError('Failed to save assignments. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const approvedCount = items.filter((i) => i.state === 'approved').length;
  const rejectedCount = items.filter((i) => i.state === 'rejected').length;
  const pendingCount = items.filter((i) => i.state === 'pending').length;

  return (
    <div className="flex flex-col flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight mb-1">Review Assignments</h1>
        <p className="text-muted-foreground text-sm">
          Review AI reasoning, change assignees if needed, then approve or reject each assignment.
        </p>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-4 text-sm mb-4 flex-wrap">
        <span className="text-muted-foreground">{items.length} assignments{streaming ? '…' : ''}</span>
        <span className="text-green-600 dark:text-green-400 font-medium">{approvedCount} approved</span>
        <span className="text-red-600 dark:text-red-400 font-medium">{rejectedCount} rejected</span>
        <span className="text-muted-foreground">{pendingCount} pending</span>
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="outline" onClick={approveAll} disabled={pendingCount === 0}>Approve all</Button>
          <Button size="sm" variant="outline" onClick={rejectAll} disabled={pendingCount === 0}>Reject all</Button>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Empty state while first batch loads */}
      {streaming && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">AI is assigning tasks…</p>
        </div>
      )}

      {streamError && (
        <p className="text-destructive text-sm mb-4">{streamError}</p>
      )}

      {/* Items */}
      <div className="flex flex-col gap-4 mb-8">
        {items.map((item) => {
          const original = members.find((m) => m.id === item.result.assigneeId);
          const selected = item.overrideAssigneeId
            ? members.find((m) => m.id === item.overrideAssigneeId)
            : original;
          const changed = item.overrideAssigneeId && item.overrideAssigneeId !== item.result.assigneeId;

          return (
            <div
              key={item.result.taskId}
              className={cn(
                'rounded-xl border p-4 flex flex-col gap-3 transition-colors',
                item.state === 'approved' && 'border-green-500/50 bg-green-50/40 dark:bg-green-900/10',
                item.state === 'rejected' && 'border-red-500/30 bg-red-50/40 dark:bg-red-900/10 opacity-50',
                item.state === 'pending' && 'bg-card',
              )}
            >
              {/* Task name + actions */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="font-semibold text-sm">{item.result.taskName}</p>
                  {item.result.overCapacity && (
                    <span className="flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 px-2 py-0.5 text-[10px] font-medium shrink-0">
                      <AlertTriangle className="h-3 w-3" /> Over capacity
                    </span>
                  )}
                </div>
                {item.state !== 'rejected' && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.state === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-500/50 hover:bg-green-50 dark:hover:bg-green-900/20"
                        onClick={() => approve(item.result.taskId)}
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
                      className="text-destructive hover:text-destructive"
                      onClick={() => reject(item.result.taskId)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>

              {/* AI reasoning */}
              <div className="flex gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{item.result.reasonForAssignment}</p>
              </div>

              {/* Assignee row */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs text-muted-foreground w-20 shrink-0">Assigned to</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px]">
                      {selected ? selected.name[0].toUpperCase() : '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span className={cn('text-sm font-medium', changed && 'text-blue-600 dark:text-blue-400')}>
                    {selected ? selected.name : item.result.assigneeName}
                    {changed && <span className="text-xs font-normal text-muted-foreground ml-1">(changed)</span>}
                  </span>
                </div>

                {item.state !== 'rejected' && members.length > 0 && (
                  <select
                    value={item.overrideAssigneeId ?? item.result.assigneeId}
                    onChange={(e) => changeAssignee(item.result.taskId, e.target.value)}
                    className="ml-auto rounded-md border bg-background px-2 py-1 text-xs"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (cap: {m.availableCapacity})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          );
        })}

        {/* Streaming indicator after existing items */}
        {streaming && items.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            Loading more assignments…
          </div>
        )}
      </div>

      {saveError && <p className="text-destructive text-sm mb-4">{saveError}</p>}

      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>
        <Button
          size="lg"
          className="px-8"
          disabled={saving || approvedCount === 0}
          onClick={handleConfirm}
        >
          {saving ? 'Saving…' : `Confirm ${approvedCount} assignment${approvedCount !== 1 ? 's' : ''} →`}
        </Button>
      </div>
    </div>
  );
}
