export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  count?: number;
}

export type TaskFilter = 'all' | 'completed' | 'incomplete';
