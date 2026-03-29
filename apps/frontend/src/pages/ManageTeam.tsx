import { useState, useEffect, useCallback } from 'react';
import { memberService, type Member, type MemberInput } from '@/services/memberService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Search, Plus, Pencil, Trash2, X, Check, User } from 'lucide-react';

const EMPTY_FORM: MemberInput = {
  name: '',
  position: '',
  personalBackground: '',
  skills: [],
};

function capacityColor(cap: number) {
  if (cap >= 7) return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
  if (cap >= 4) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400';
  return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
}

// ─── Member form (used in Sheet) ──────────────────────────────────────────────
function MemberForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: MemberInput;
  onSave: (data: MemberInput) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<MemberInput>(initial);
  const [skillInput, setSkillInput] = useState('');

  function set(field: keyof MemberInput, value: string | number | string[]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function addSkill() {
    const s = skillInput.trim();
    if (!s || form.skills.includes(s)) return;
    set('skills', [...form.skills, s]);
    setSkillInput('');
  }

  function removeSkill(skill: string) {
    set('skills', form.skills.filter((s) => s !== skill));
  }

  const valid = form.name.trim() && form.position.trim();

  return (
    <div className="flex flex-col gap-5 px-6 py-5 flex-1 overflow-y-auto">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground">Name *</label>
        <Input
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Full name"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground">Position *</label>
        <Input
          value={form.position}
          onChange={(e) => set('position', e.target.value)}
          placeholder="e.g. Backend Developer"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground">Background</label>
        <Textarea
          value={form.personalBackground ?? ''}
          onChange={(e) => set('personalBackground', e.target.value)}
          placeholder="Skills, experience, notes…"
          className="resize-none min-h-20 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground">Skills</label>
        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Add a skill"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          />
          <Button type="button" variant="outline" size="sm" onClick={addSkill}>
            Add
          </Button>
        </div>
        {form.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {form.skills.map((s) => (
              <Badge key={s} variant="secondary" className="gap-1 pr-1">
                {s}
                <button
                  onClick={() => removeSkill(s)}
                  className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2 justify-end">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button disabled={!valid || saving} onClick={() => onSave(form)}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </div>
  );
}

// ─── Member detail / edit sheet ───────────────────────────────────────────────
function MemberSheet({
  member,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: {
  member: Member | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onUpdate: (id: string, data: MemberInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleClose(v: boolean) {
    if (!v) { setEditing(false); setConfirmDelete(false); }
    onOpenChange(v);
  }

  async function handleSave(data: MemberInput) {
    if (!member) return;
    setSaving(true);
    try { await onUpdate(member.id, data); setEditing(false); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!member) return;
    setSaving(true);
    try { await onDelete(member.id); onOpenChange(false); }
    finally { setSaving(false); setConfirmDelete(false); }
  }

  if (!member) return null;

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>{editing ? 'Edit Member' : member.name}</SheetTitle>
        </SheetHeader>
        <Separator />

        {editing ? (
          <MemberForm
            initial={{
              name: member.name,
              position: member.position,
              personalBackground: member.personalBackground,
              skills: [...member.skills],
            }}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
            saving={saving}
          />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 text-lg">
                  <AvatarFallback>{member.name[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-base">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.position}</p>
                </div>
              </div>

              <Separator />

              <Row label="Position" value={member.position} />

              {member.personalBackground && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Background</span>
                  <p className="text-sm leading-relaxed">{member.personalBackground}</p>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground">Skills</span>
                {member.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No skills listed</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground">Available Capacity</span>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        member.availableCapacity >= 7 ? 'bg-green-500' :
                        member.availableCapacity >= 4 ? 'bg-yellow-500' : 'bg-red-500',
                      )}
                      style={{ width: `${(member.availableCapacity / member.totalCapacity) * 100}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      capacityColor(member.availableCapacity),
                    )}
                  >
                    {member.availableCapacity} / {member.totalCapacity}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <SheetFooter className="px-6 py-4 flex-row justify-between">
              {confirmDelete ? (
                <div className="flex items-center gap-2 w-full">
                  <span className="text-sm text-destructive flex-1">Delete this member?</span>
                  <Button size="sm" variant="destructive" disabled={saving} onClick={handleDelete}>
                    <Check className="h-3.5 w-3.5 mr-1" /> Confirm
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 w-full justify-end">
                  <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
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
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 items-start">
      <span className="text-xs text-muted-foreground w-24 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ManageTeam() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [addSaving, setAddSaving] = useState(false);

  useEffect(() => {
    memberService.findAllMembers()
      .then(setMembers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Debounced search
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      memberService.findAllMembers().then(setMembers).catch(() => {});
      return;
    }
    const timer = setTimeout(() => {
      memberService.findByName(trimmed)
        .then(setMembers)
        .catch(() => {
          setMembers((prev) =>
            prev.filter((m) =>
              m.name.toLowerCase().includes(trimmed.toLowerCase()),
            ),
          );
        });
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAdd = useCallback(async (data: MemberInput) => {
    setAddSaving(true);
    try {
      const created = await memberService.addMember(data);
      setMembers((prev) => [...prev, created]);
      setAddSheetOpen(false);
    } finally {
      setAddSaving(false);
    }
  }, []);

  const handleUpdate = useCallback(async (id: string, data: MemberInput) => {
    const updated = await memberService.updateMember(id, data);
    setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
    setSelectedMember(updated);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await memberService.deleteMember(id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return (
    <div className="flex flex-col flex-1 px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Manage Team</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {members.length} member{members.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setAddSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Member
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search by name…"
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Separator className="mb-6" />

      {loading && <p className="text-muted-foreground text-sm">Loading…</p>}
      {error && <p className="text-destructive text-sm">{error}</p>}

      {/* Member grid */}
      {!loading && !error && (
        members.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 text-muted-foreground">
            <User className="h-10 w-10 opacity-30" />
            <p className="text-sm">No members found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() => { setSelectedMember(m); setSheetOpen(true); }}
                className="rounded-xl border bg-card p-5 text-left flex flex-col gap-3 hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {/* Top row */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback>{m.name[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{m.position}</p>
                  </div>
                </div>

                {/* Skills */}
                {m.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {m.skills.slice(0, 4).map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                    ))}
                    {m.skills.length > 4 && (
                      <Badge variant="outline" className="text-[10px]">
                        +{m.skills.length - 4}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Capacity bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        m.availableCapacity >= 7 ? 'bg-green-500' :
                        m.availableCapacity >= 4 ? 'bg-yellow-500' : 'bg-red-500',
                      )}
                      style={{ width: `${(m.availableCapacity / m.totalCapacity) * 100}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-semibold rounded-full px-2 py-0.5',
                      capacityColor(m.availableCapacity),
                    )}
                  >
                    {m.availableCapacity}/{m.totalCapacity}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )
      )}

      {/* Detail / Edit sheet */}
      <MemberSheet
        member={selectedMember}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      {/* Add member sheet */}
      <Sheet open={addSheetOpen} onOpenChange={setAddSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col gap-0 p-0">
          <SheetHeader className="px-6 pt-6 pb-4">
            <SheetTitle>Add Member</SheetTitle>
          </SheetHeader>
          <Separator />
          <MemberForm
            initial={EMPTY_FORM}
            onSave={handleAdd}
            onCancel={() => setAddSheetOpen(false)}
            saving={addSaving}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
