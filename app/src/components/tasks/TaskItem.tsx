import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import type { Task } from '@/types/task';
import { Trash2, Edit2, Check, X, Loader2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, title: string) => Promise<void>;
  disabled?: boolean;
}

export function TaskItem({ task, onToggle, onDelete, onEdit, disabled }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async () => {
    if (isToggling || disabled) return;
    setIsToggling(true);
    try {
      await onToggle(task.id, !task.completed);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting || disabled) return;
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || isSaving || disabled) return;
    setIsSaving(true);
    try {
      await onEdit(task.id, editTitle.trim());
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          disabled={isSaving}
          className="flex-1"
          maxLength={200}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveEdit();
            if (e.key === 'Escape') handleCancelEdit();
          }}
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={handleSaveEdit}
          disabled={!editTitle.trim() || isSaving}
          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleCancelEdit}
          disabled={isSaving}
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 p-3 bg-card border rounded-lg transition-all ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleToggle}
        disabled={isToggling || disabled}
        className="shrink-0"
      />
      
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            task.completed ? 'line-through text-muted-foreground' : ''
          }`}
        >
          {task.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(task.createdAt)}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          disabled={disabled || isToggling || isDeleting}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleDelete}
          disabled={disabled || isToggling || isDeleting}
          className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-100"
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
