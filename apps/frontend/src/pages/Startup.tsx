import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function StartupPage() {
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
            <div className="text-lg font-medium mb-4 startup-title">
              <h2>Try Now</h2>
            </div>
            <Button
              variant="outline"
              className="startup-button"
              onClick={() => navigate('/pages/taskcreation')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
