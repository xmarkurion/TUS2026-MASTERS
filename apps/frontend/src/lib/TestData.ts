const tasks: Tasks[] = [
  {
    id: '65c1a2f9e13a9b7c4f1a0001',
    title: 'Setup project repository',
    description: 'Initialize Git repo and setup basic project structure',
    status: 'TODO',
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-02-01T09:00:00Z',
    difficulty: 'easy',
    assigneeId: 101,
    effort: 2,
  },
  {
    id: '65c1a2f9e13a9b7c4f1a0002',
    title: 'Design database schema',
    description: 'Create ER diagram and normalize tables',
    status: 'IN_PROGRESS',
    createdAt: '2026-02-01T10:30:00Z',
    updatedAt: '2026-02-02T08:15:00Z',
    difficulty: 'medium',
    assigneeId: 102,
    effort: 5,
  },
  {
    id: `65c1a2f9e13a9b7c4f1a0003`,
    title: 'Implement authentication',
    description: 'JWT-based authentication with Spring Security',
    status: 'IN_REVIEW',
    createdAt: '2026-02-02T11:00:00Z',
    updatedAt: '2026-02-04T14:45:00Z',
    difficulty: 'hard',
    assigneeId: 103,
    effort: 8,
  },
  {
    id: `65c1a2f9e13a9b7c4f1a0004`,
    title: 'Create task assignment logic',
    description: 'Auto-assign tasks based on skill and workload',
    status: 'TODO',
    createdAt: '2026-02-03T09:20:00Z',
    updatedAt: '2026-02-03T09:20:00Z',
    difficulty: 'hard',
    assigneeId: null,
    effort: 10,
  },
  {
    id: `65c1a2f9e13a9b7c4f1a0005`,
    title: 'UI wireframe for dashboard',
    description: 'Create initial wireframes for task board',
    status: 'DONE',
    createdAt: '2026-01-30T15:00:00Z',
    updatedAt: '2026-02-01T12:10:00Z',
    difficulty: 'medium',
    assigneeId: 104,
    effort: 4,
  },
  {
    id: `65c1a2f9e13a9b7c4f1a0006`,
    title: 'Fix pagination bug',
    description: 'Incorrect page count when filtering tasks',
    status: 'BLOCKED',
    createdAt: '2026-02-04T16:30:00Z',
    updatedAt: '2026-02-05T09:00:00Z',
    difficulty: 'easy',
    assigneeId: null,
    effort: 1,
  },
  {
    id: `65c1a2f9e13a9b7c4f1a0007`,
    title: 'Add audit logging',
    description: 'Log task status changes for compliance',
    status: 'IN_PROGRESS',
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-02-05T13:40:00Z',
    difficulty: null,
    assigneeId: 105,
    effort: 6,
  },
];
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
  assigneeId?: number | null;
  effort?: number; // story points / hours
}

// User data for testing
export interface User {
  _id: string;
  personName: string;
  position: string;
  personalBackground?: string;
  skills: string[];
  availableCapacity: number; // 0–10 only
}
export const UserMock: User[] = [
  {
    _id: '65c1a2f9e13a9b7c4f1a0011',
    personName: 'Aarav Patel',
    position: 'Backend Developer',
    personalBackground: 'Strong in Spring Boot and REST APIs.',
    skills: ['Java', 'Spring Boot', 'MySQL'],
    availableCapacity: 9,
  },
  {
    _id: '65c1a2f9e13a9b7c4f1a0012',
    personName: 'Emma Wilson',
    position: 'Frontend Developer',
    personalBackground: 'UX-focused React developer.',
    skills: ['React', 'TypeScript', 'Tailwind'],
    availableCapacity: 7,
  },
  {
    _id: '65c1a2f9e13a9b7c4f1a0013',
    personName: 'Jordan Smith',
    position: 'DevOps Specialist',
    personalBackground: 'Good communicator with the Scrum team.',
    skills: ['Docker', 'Kubernetes', 'CI/CD'],
    availableCapacity: 10,
  },
];
