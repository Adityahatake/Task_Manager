import { Button } from '@/components/ui/button';
import type { TaskFilter as FilterType } from '@/types/task';
import { List, CheckCircle2, Circle } from 'lucide-react';

interface TaskFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    completed: number;
    incomplete: number;
  };
}

const filters: { value: FilterType; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All', icon: <List className="h-4 w-4" /> },
  { value: 'incomplete', label: 'Active', icon: <Circle className="h-4 w-4" /> },
  { value: 'completed', label: 'Completed', icon: <CheckCircle2 className="h-4 w-4" /> },
];

export function TaskFilter({ currentFilter, onFilterChange, taskCounts }: TaskFilterProps) {
  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={currentFilter === filter.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          className="gap-2"
        >
          {filter.icon}
          {filter.label}
          <span className="ml-1 text-xs bg-background/20 px-1.5 py-0.5 rounded-full">
            {taskCounts[filter.value]}
          </span>
        </Button>
      ))}
    </div>
  );
}
