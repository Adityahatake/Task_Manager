import type { Task, ApiResponse } from '@/types/task';

// In-memory storage for mock API
let mockTasks: Task[] = [
  {
    id: 1,
    title: 'Welcome to Task Manager! 👋',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Try adding a new task above',
    completed: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 3,
    title: 'Click the checkbox to mark as done',
    completed: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 4,
    title: 'Use the edit button to modify tasks',
    completed: false,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 5,
    title: 'Toggle dark mode with the sun/moon icon',
    completed: false,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
];
let mockNextId = 6;

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockTaskApi = {
  // GET /tasks - Return all tasks
  getAll: async (filter?: 'completed' | 'incomplete'): Promise<ApiResponse<Task[]>> => {
    await delay(300); // Simulate network delay
    
    let result = [...mockTasks];
    
    if (filter !== undefined) {
      const isCompleted = filter === 'completed';
      result = result.filter(task => task.completed === isCompleted);
    }
    
    // Sort by createdAt (newest first)
    result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return {
      success: true,
      data: result,
      count: result.length,
    };
  },

  // POST /tasks - Create a new task
  create: async (title: string): Promise<ApiResponse<Task>> => {
    await delay(300);
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return {
        success: false,
        error: 'Title is required and must be a non-empty string',
      } as ApiResponse<Task>;
    }
    
    const newTask: Task = {
      id: mockNextId++,
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    mockTasks.unshift(newTask);
    
    return {
      success: true,
      data: newTask,
      message: 'Task created successfully',
    };
  },

  // PATCH /tasks/:id - Update a task
  update: async (id: number, updates: { completed?: boolean; title?: string }): Promise<ApiResponse<Task>> => {
    await delay(300);
    
    const taskIndex = mockTasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return {
        success: false,
        error: 'Task not found',
      } as ApiResponse<Task>;
    }
    
    if (updates.completed !== undefined) {
      mockTasks[taskIndex].completed = updates.completed;
    }
    
    if (updates.title !== undefined) {
      if (typeof updates.title !== 'string' || updates.title.trim() === '') {
        return {
          success: false,
          error: 'Title must be a non-empty string',
        } as ApiResponse<Task>;
      }
      mockTasks[taskIndex].title = updates.title.trim();
    }
    
    return {
      success: true,
      data: mockTasks[taskIndex],
      message: 'Task updated successfully',
    };
  },

  // DELETE /tasks/:id - Delete a task
  delete: async (id: number): Promise<ApiResponse<Task>> => {
    await delay(300);
    
    const taskIndex = mockTasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return {
        success: false,
        error: 'Task not found',
      } as ApiResponse<Task>;
    }
    
    const deletedTask = mockTasks.splice(taskIndex, 1)[0];
    
    return {
      success: true,
      data: deletedTask,
      message: 'Task deleted successfully',
    };
  },
};
