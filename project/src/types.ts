import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  department: string;
  team: string;
  completed: boolean;
  credits: number;
  dependencies?: string[];
  deadline?: string;
}

export const createTask = (task: Omit<Task, 'id' | 'completed' | 'credits'>): Task => ({
  id: uuidv4(),
  completed: false,
  credits: calculateCredits(task.priority),
  ...task,
});

const calculateCredits = (priority: Task['priority']): number => {
  switch (priority) {
    case 'low':
      return 1;
    case 'medium':
      return 2;
    case 'high':
      return 3;
    default:
      return 1;
  }
};

export interface Department {
  name: string;
  teams: string[];
}

export const departments: Department[] = [
  {
    name: 'Marketing',
    teams: ['Content', 'Social Media', 'Analytics'],
  },
  {
    name: 'Sales',
    teams: ['Inside Sales', 'Field Sales', 'Customer Success'],
  },
  {
    name: 'Development',
    teams: ['Frontend', 'Backend', 'QA'],
  },
  {
    name: 'Operations',
    teams: ['HR', 'Finance', 'Facilities'],
  },
];