import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskFilter } from '@/types/task';
import { taskApi, ApiError } from '@/services/api';
import { mockTaskApi } from '@/services/mockApi';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  addTask: (title: string) => Promise<void>;
  toggleTask: (id: number, completed: boolean) => Promise<void>;
  updateTaskTitle: (id: number, title: string) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  refreshTasks: () => Promise<void>;
  isMockMode: boolean;
}

// Check if we're in a static deployment (no backend)
const isStaticDeployment = () => {
  // If the API URL is empty or we're on a static host, use mock mode
  return !import.meta.env.VITE_API_URL && window.location.hostname.includes('ok.kimi');
};

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [useMockApi, setUseMockApi] = useState(false);

  // Determine which API to use
  const api = useMockApi || isStaticDeployment() ? mockTaskApi : taskApi;

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filterParam = filter === 'all' ? undefined : filter;
      const response = await api.getAll(filterParam);
      if (response.success) {
        setTasks(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch tasks');
      }
    } catch (err) {
      if (!useMockApi && !isStaticDeployment()) {
        // Try switching to mock API on first failure
        setUseMockApi(true);
        return;
      }
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Network error. Please check if the server is running.');
      }
    } finally {
      setLoading(false);
    }
  }, [filter, api, useMockApi]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title: string) => {
    setError(null);
    try {
      const response = await api.create(title);
      if (response.success) {
        setTasks(prev => [response.data, ...prev]);
      } else {
        setError(response.error || 'Failed to create task');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create task');
      }
      throw err;
    }
  };

  const toggleTask = async (id: number, completed: boolean) => {
    setError(null);
    try {
      const response = await api.update(id, { completed });
      if (response.success) {
        setTasks(prev =>
          prev.map(task => (task.id === id ? response.data : task))
        );
      } else {
        setError(response.error || 'Failed to update task');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update task');
      }
      throw err;
    }
  };

  const updateTaskTitle = async (id: number, title: string) => {
    setError(null);
    try {
      const response = await api.update(id, { title });
      if (response.success) {
        setTasks(prev =>
          prev.map(task => (task.id === id ? response.data : task))
        );
      } else {
        setError(response.error || 'Failed to update task');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update task');
      }
      throw err;
    }
  };

  const deleteTask = async (id: number) => {
    setError(null);
    try {
      const response = await api.delete(id);
      if (response.success) {
        setTasks(prev => prev.filter(task => task.id !== id));
      } else {
        setError(response.error || 'Failed to delete task');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete task');
      }
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    filter,
    setFilter,
    addTask,
    toggleTask,
    updateTaskTitle,
    deleteTask,
    refreshTasks: fetchTasks,
    isMockMode: useMockApi || isStaticDeployment(),
  };
}
