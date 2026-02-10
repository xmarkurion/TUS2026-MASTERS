export type TaskStatus =
  | 'TODO'
  | 'IN_PROGRESS'
  | 'IN_REVIEW'
  | 'BLOCKED'
  | 'DONE';

export type TaskDifficulty = 'easy' | 'medium' | 'hard' | null;

export interface Tasks {
  id: string;
  title: string;
  description: string;

  status: TaskStatus;

  createdAt: string;
  updatedAt: string;

  difficulty?: TaskDifficulty;
  assigneeId?: string | null;
  effort?: number; // story points / hours
}

export interface User {
  _id: string;
  personName: string;
  position: string;
  personalBackground?: string;
  skills: string[];
  availableCapacity: number; // 0–10 only
}
