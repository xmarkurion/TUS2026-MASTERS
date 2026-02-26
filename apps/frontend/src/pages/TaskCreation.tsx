import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';

export default function TaskCreation() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1">
      <main className="flex-1 p-6 flex flex-col">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-2xl font-bold">AI Task Management Assistant</h1>
        </div>

        <Separator className="mb-4" />

        <div className="flex-1 flex items-center justify-center w-full p-6 startup-scale">
          <div className="text-center">
            <div className="text-lg font-medium mb-4 w-full startup-title">
              <h2>Enter goals for your next sprint</h2>
              <Textarea
                className="startup-textarea h-40"
                placeholder="Describe your goals for the next sprint..."
                required
              />
            </div>

            <Button
              variant="outline"
              className="startup-button"
              onClick={() => navigate('/pages/taskboard')}
            >
              Send
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
