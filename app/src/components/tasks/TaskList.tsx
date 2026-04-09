import type { Task } from '@/types/task';
import { TaskItem } from './TaskItem';
import { Loader2, ClipboardList } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, title: string) => Promise<void>;
}

export function TaskList({ tasks, loading, onToggle, onDelete, onEdit }: TaskListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
        <ClipboardList className="h-12 w-12 opacity-50" />
        <p className="text-sm">No tasks found</p>
        <p className="text-xs opacity-70">Add a new task to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
