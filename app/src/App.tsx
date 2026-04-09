import { AlertCircle, RefreshCw, Database } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTasks } from '@/hooks/useTasks';
import { TaskForm, TaskList, TaskFilter } from '@/components/tasks';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { TaskFilter as FilterType } from '@/types/task';
import './App.css';

function App() {
  const {
    tasks,
    loading,
    error,
    filter,
    setFilter,
    addTask,
    toggleTask,
    updateTaskTitle,
    deleteTask,
    refreshTasks,
    isMockMode,
  } = useTasks();

  // Calculate task counts for filter buttons
  const taskCounts = {
    all: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    incomplete: tasks.filter((t) => !t.completed).length,
  };

  // Filter tasks locally for accurate counts
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-background py-8 px-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="text-center flex-1 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Task Manager</h1>
            <p className="text-muted-foreground">
              Stay organized and track your daily tasks
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Mock Mode Indicator */}
        {isMockMode && (
          <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
            <Database className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-amber-800 dark:text-amber-200">
                Running in demo mode. Tasks are stored in memory and will reset on refresh.
              </span>
              <Badge variant="outline" className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300">
                Demo
              </Badge>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshTasks}
                className="gap-2"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">My Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Task Form */}
            <TaskForm onSubmit={addTask} disabled={loading} />

            {/* Filter Buttons */}
            <TaskFilter
              currentFilter={filter as FilterType}
              onFilterChange={setFilter}
              taskCounts={taskCounts}
            />

            {/* Task List */}
            <TaskList
              tasks={filteredTasks}
              loading={loading}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={updateTaskTitle}
            />

            {/* Stats Footer */}
            {!loading && tasks.length > 0 && (
              <div className="pt-4 border-t text-xs text-muted-foreground text-center">
                {taskCounts.completed} of {taskCounts.all} tasks completed
                {taskCounts.completed === taskCounts.all && taskCounts.all > 0 && (
                  <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                    All done! 🎉
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Built with React + Express 
        </p>
      </div>
    </div>
  );
}

export default App;
