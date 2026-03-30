import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { taskService } from '@/services/taskService';

export default function TaskCreation() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const trimmed = description.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const tasks = await taskService.generateTasks(trimmed);
      navigate('/pages/taskreview', { state: { tasks } });
    } catch (err) {
      setError((err as Error).message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            What are your sprint goals?
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Describe your goals and the AI will break them into structured tasks.
            <span className="ml-1 text-xs opacity-60">Ctrl+Enter to submit</span>
          </p>

          <Separator className="mb-6" />

          <Textarea
            className="min-h-48 text-sm resize-none mb-4"
            placeholder="e.g. Add Google OAuth login, build a dashboard for analytics, fix the checkout bug where orders fail silently..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          {error && (
            <p className="text-destructive text-sm mb-4">{error}</p>
          )}

          <div className="flex justify-end">
            <Button
              size="lg"
              className="px-8"
              disabled={loading || !description.trim()}
              onClick={handleSubmit}
            >
              {loading ? 'Generating tasks…' : 'Generate Tasks'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
