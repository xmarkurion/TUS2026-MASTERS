import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '@/services/taskService';
import { memberService, type Member } from '@/services/memberService';
import { Task, Status } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Wand2, UserCheck, AlertTriangle } from 'lucide-react';

const STATUS_LABELS: Record<Status, string> = {
  [Status.TODO]: 'To Do',
  [Status.IN_PROGRESS]: 'In Progress',
  [Status.IN_REVIEW]: 'In Review',
  [Status.BLOCKED]: 'Blocked',
  [Status.DONE]: 'Done',
};

const STATUS_COLORS: Record<Status, string> = {
  [Status.TODO]: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  [Status.IN_PROGRESS]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  [Status.IN_REVIEW]: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  [Status.BLOCKED]: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  [Status.DONE]: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
};

function capacityColor(cap: number) {
  if (cap >= 7) return 'bg-green-500';
  if (cap >= 4) return 'bg-yellow-500';
  return 'bg-red-500';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [assignMsg, setAssignMsg] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([taskService.findAllTasks(), memberService.findAllMembers()])
      .then(([t, m]) => { setTasks(t); setMembers(m); })
      .finally(() => setLoading(false));
  }, []);

  async function handleAssignAll() {
    setAssigning(true);
    setAssignMsg(null);
    try {
      const results = await taskService.assignAll();
      navigate('/pages/assignreview', { state: { results, members } });
    } catch {
      setAssignMsg('Assignment failed. Please try again.');
    } finally {
      setAssigning(false);
    }
  }

  const statusCounts = Object.values(Status).reduce(
    (acc, s) => ({ ...acc, [s]: tasks.filter((t) => t.status === s).length }),
    {} as Record<Status, number>,
  );

  const blocked = tasks.filter((t) => t.status === Status.BLOCKED);
  const unassigned = tasks.filter((t) => !t.assigneeId && t.status !== Status.DONE);

  return (
    <div className="flex flex-col flex-1 px-6 py-8 gap-8">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">AI Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Sprint health at a glance</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => navigate('/pages/taskcreation')}>
            <Wand2 className="h-4 w-4 mr-1.5" /> Generate Tasks
          </Button>
          <Button disabled={assigning} onClick={handleAssignAll}>
            <UserCheck className="h-4 w-4 mr-1.5" />
            {assigning ? 'Assigning…' : 'Auto Assign All'}
          </Button>
        </div>
      </div>

      {assignMsg && (
        <p className={cn('text-sm', assignMsg.includes('failed') ? 'text-destructive' : 'text-green-600 dark:text-green-400')}>
          {assignMsg}
        </p>
      )}

      {loading ? <p className="text-muted-foreground text-sm">Loading…</p> : (
        <>
          {/* Sprint summary */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Sprint Summary
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.values(Status).map((s) => (
                <div key={s} className="rounded-xl border bg-card p-4 flex flex-col gap-1">
                  <span className={cn('self-start rounded-full px-2.5 py-0.5 text-[11px] font-medium', STATUS_COLORS[s])}>
                    {STATUS_LABELS[s]}
                  </span>
                  <span className="text-3xl font-extrabold mt-1">{statusCounts[s]}</span>
                  <span className="text-xs text-muted-foreground">task{statusCounts[s] !== 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Team capacity */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Team Capacity
            </h2>
            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No team members found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {members.map((m) => (
                  <div key={m.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback>{m.name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.position}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all', capacityColor(m.availableCapacity))}
                            style={{ width: `${(m.availableCapacity / m.totalCapacity) * 100}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-muted-foreground shrink-0">
                          {m.availableCapacity}/{m.totalCapacity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Blocked tasks */}
          {blocked.length > 0 && (
            <>
              <Separator />
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" /> Blocked Tasks
                </h2>
                <div className="flex flex-col gap-2">
                  {blocked.map((t) => {
                    const assignee = members.find((m) => m.id === t.assigneeId);
                    return (
                      <div key={t.id} className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-900/10 px-4 py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{t.taskName}</p>
                          <p className="text-xs text-muted-foreground truncate">{t.taskDesc}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {t.difficulty && (
                            <Badge variant="outline" className="text-[10px] capitalize">{t.difficulty}</Badge>
                          )}
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px]">
                              {assignee ? assignee.name[0].toUpperCase() : '?'}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {/* Unassigned tasks */}
          {unassigned.length > 0 && (
            <>
              <Separator />
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Unassigned Tasks
                </h2>
                <div className="flex flex-col gap-2">
                  {unassigned.map((t) => (
                    <div key={t.id} className="rounded-xl border bg-card px-4 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{t.taskName}</p>
                        <span className={cn('text-[11px] font-medium rounded-full px-2 py-0.5', STATUS_COLORS[t.status])}>
                          {STATUS_LABELS[t.status]}
                        </span>
                      </div>
                      {t.difficulty && (
                        <Badge variant="outline" className="text-[10px] capitalize shrink-0">{t.difficulty}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}
