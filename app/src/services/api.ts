import type { Task, ApiResponse } from '@/types/task';

const API_URL = ''; // Use relative URLs for same-origin deployment

class ApiError extends Error {
  status: number;
  
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
  }
  return response.json();
}

export const taskApi = {
  // GET /tasks - Return all tasks
  getAll: async (filter?: 'completed' | 'incomplete'): Promise<ApiResponse<Task[]>> => {
    const url = new URL(`${API_URL}/tasks`);
    if (filter !== undefined) {
      url.searchParams.append('completed', filter === 'completed' ? 'true' : 'false');
    }
    const response = await fetch(url.toString());
    return handleResponse<ApiResponse<Task[]>>(response);
  },

  // POST /tasks - Create a new task
  create: async (title: string): Promise<ApiResponse<Task>> => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    return handleResponse<ApiResponse<Task>>(response);
  },

  // PATCH /tasks/:id - Update a task
  update: async (id: number, updates: { completed?: boolean; title?: string }): Promise<ApiResponse<Task>> => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<ApiResponse<Task>>(response);
  },

  // DELETE /tasks/:id - Delete a task
  delete: async (id: number): Promise<ApiResponse<Task>> => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<ApiResponse<Task>>(response);
  },
};

export { ApiError };
