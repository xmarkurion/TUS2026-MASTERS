import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { appConfig } from '@/config/app';
import { ModeToggle } from '@/components/mode-toggle';

const features = [
  {
    icon: '⚡',
    title: 'AI Task Generation',
    description:
      'Describe your sprint goals in plain English and the AI instantly breaks them into structured, prioritised tasks.',
  },
  {
    icon: '🧠',
    title: 'Skill-Based Assignment',
    description:
      'Tasks are automatically matched to team members based on their skills and available capacity — no manual allocation needed.',
  },
  {
    icon: '📋',
    title: 'Drag-and-Drop Board',
    description:
      'Move tasks across columns as work progresses. Team capacity updates automatically when tasks are marked done.',
  },
  {
    icon: '🎯',
    title: 'Smart Prioritisation',
    description:
      'Tasks arrive pre-categorised by difficulty and effort so your team always knows what to tackle first.',
  },
  {
    icon: '📊',
    title: 'Capacity Tracking',
    description:
      'Each team member has an effort capacity. Completing tasks frees up capacity for the next sprint automatically.',
  },
  {
    icon: '🔄',
    title: 'Full Sprint Lifecycle',
    description:
      'From backlog to done — track every task through To Do, In Progress, In Review, Blocked, and Done.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Describe your sprint',
    description: 'Write your sprint goals or paste an epic description into the AI prompt.',
  },
  {
    step: '02',
    title: 'AI generates tasks',
    description: 'Tasks are created with names, descriptions, difficulty ratings, and effort estimates.',
  },
  {
    step: '03',
    title: 'Team gets assigned',
    description: 'The AI matches each task to the best available team member by skill and capacity.',
  },
  {
    step: '04',
    title: 'Track and ship',
    description: 'Drag tasks across the board as work progresses. Capacity adjusts in real time.',
  },
];

export default function StartupPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col min-h-full">
      {/* Top bar */}
      <div className="flex justify-end px-6 pt-4">
        <ModeToggle />
      </div>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <Badge variant="secondary" className="mb-6 px-4 py-1 text-sm font-medium">
          AI-Powered · Sprint Planning · Skill-Based Assignment
        </Badge>

        <h1 className="text-5xl font-extrabold tracking-tight leading-tight max-w-3xl mb-4">
          {appConfig.name}
        </h1>

        <p className="text-muted-foreground text-lg max-w-2xl mb-10">
          Describe your sprint goals and let AI generate tasks, assign them to the right people
          based on skills and capacity, and track everything on a live Kanban board.
        </p>

        <div className="flex gap-3 flex-wrap justify-center">
          <Button
            size="lg"
            className="px-8 text-base"
            onClick={() => navigate('/pages/taskcreation')}
          >
            Start a Sprint
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 text-base"
            onClick={() => navigate('/pages/taskboard')}
          >
            View Board
          </Button>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full border-t" />

      {/* How it works */}
      <section className="px-6 py-16 bg-muted/30">
        <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-12">
          How it works
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {steps.map((s) => (
            <div key={s.step} className="flex flex-col gap-3">
              <span className="text-3xl font-extrabold text-muted-foreground/30">{s.step}</span>
              <h3 className="font-semibold text-base">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="w-full border-t" />

      {/* Features */}
      <section className="px-6 py-16">
        <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-12">
          Everything your sprint needs
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border bg-card p-6 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="font-semibold text-base">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 border-t text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to plan your next sprint?</h2>
        <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
          Let the AI do the heavy lifting — task creation, skill matching, and capacity planning in seconds.
        </p>
        <Button
          size="lg"
          className="px-10 text-base"
          onClick={() => navigate('/pages/taskcreation')}
        >
          Start a Sprint
        </Button>
      </section>
    </div>
  );
}
