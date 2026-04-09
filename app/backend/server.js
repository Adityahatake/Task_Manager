const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist folder (frontend build)
app.use(express.static(path.join(__dirname, '../dist')));

// In-memory storage for tasks
let tasks = [];
let nextId = 1;

// GET /tasks - Return all tasks
app.get('/tasks', (req, res) => {
  try {
    // Optional: Filter by completed status
    const { completed } = req.query;
    let result = tasks;
    
    if (completed !== undefined) {
      const isCompleted = completed === 'true';
      result = tasks.filter(task => task.completed === isCompleted);
    }
    
    // Sort by createdAt (newest first)
    result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      data: result,
      count: result.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
  try {
    const { title } = req.body;
    
    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Title is required and must be a non-empty string'
      });
    }
    
    const newTask = {
      id: nextId++,
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    
    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Task created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create task'
    });
  }
});

// PATCH /tasks/:id - Update a task status
app.patch('/tasks/:id', (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { completed, title } = req.body;
    
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    // Update fields if provided
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'Completed must be a boolean'
        });
      }
      tasks[taskIndex].completed = completed;
    }
    
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Title must be a non-empty string'
        });
      }
      tasks[taskIndex].title = title.trim();
    }
    
    res.json({
      success: true,
      data: tasks[taskIndex],
      message: 'Task updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update task'
    });
  }
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    
    res.json({
      success: true,
      data: deletedTask,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete task'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all route to serve the frontend app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  GET    /tasks     - Get all tasks`);
  console.log(`  POST   /tasks     - Create a new task`);
  console.log(`  PATCH  /tasks/:id - Update a task`);
  console.log(`  DELETE /tasks/:id - Delete a task`);
});
