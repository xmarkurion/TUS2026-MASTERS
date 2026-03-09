// src/types/task.ts

export enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  BLOCKED = 'BLOCKED',
  DONE = 'DONE',
}

export enum TaskDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface Task {
  id: string;
  taskName: string;
  difficulty: TaskDifficulty;
  taskDesc: string;
  assigneeId: string;
  effort: number;
  // Instants are serialized as ISO 8601 strings in JSON (e.g., '2026-03-06T08:21:37.667Z')
  createdAt: string; 
  updatedAt: string;
  status: Status;
}