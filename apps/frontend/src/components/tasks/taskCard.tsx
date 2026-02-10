import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tasks } from '@/lib/types';
import { UserMock } from '@/lib/testData';

export function TaskCard({ task }: { task: Tasks }) {
  const assignee = UserMock.find((u) => u._id === task.assigneeId);

  return (
    <Card className="rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <p className="text-muted-foreground">{task.description}</p>
        <div className="flex justify-between items-center">
          {task.difficulty && <Badge>{task.difficulty}</Badge>}
          <span className="text-muted-foreground">Effort: {task.effort}</span>
        </div>
        {assignee && (
          <div className="flex items-center gap-2 pt-1">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{assignee.personName[0]}</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground">{assignee.personName}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
