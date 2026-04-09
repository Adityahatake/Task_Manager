# Task Manager - Full Stack Assignment

A simple Task Manager application built with React (frontend) and Express (backend).

## Features

- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as completed/incomplete
- ✅ Edit task titles inline
- ✅ Filter tasks by status (All, Active, Completed)
- ✅ Loading and error states
- ✅ Responsive design with clean UI
- ✅ Dark/Light theme toggle
- ✅ Works without backend (mock API mode)

## Tech Stack

**Frontend:**
- React + TypeScript
- Vite (build tool)
- Tailwind CSS
- shadcn/ui components
- Lucide React icons
- Custom theme provider (dark/light/system)

**Backend:**
- Node.js + Express
- In-memory storage
- CORS enabled
- RESTful API design

## Project Structure

```
app/
├── backend/           # Express backend
│   ├── server.js      # Main server file
│   └── package.json
├── src/               # React frontend
│   ├── components/    # React components
│   ├── hooks/         # Custom hooks
│   ├── services/      # API services
│   ├── types/         # TypeScript types
│   └── App.tsx        # Main app component
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+ installed

### 1. Start the Backend

```bash
cd backend
npm install
npm start
```

The backend will start on `http://localhost:3001`

### 2. Start the Frontend

In a new terminal:

```bash
# From the root directory
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### 3. Open in Browser

Navigate to `http://localhost:5173` to use the Task Manager app.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks (optional: `?completed=true/false`) |
| POST | `/tasks` | Create a new task |
| PATCH | `/tasks/:id` | Update a task (title and/or completed) |
| DELETE | `/tasks/:id` | Delete a task |
| GET | `/health` | Health check |

## Task Data Model

```typescript
{
  id: number;           // Unique identifier
  title: string;        // Task title
  completed: boolean;   // Completion status
  createdAt: string;    // ISO timestamp
}
```

## Design Decisions & Trade-offs

1. **In-Memory Storage**: Used in-memory storage instead of a database for simplicity and faster setup. Data will reset on server restart.

2. **No Authentication**: Kept the app simple without user authentication as it wasn't a core requirement.

3. **CORS Enabled**: Enabled CORS to allow frontend and backend to run on different ports during development.

4. **Component Structure**: Separated concerns with dedicated components for form, list, item, and filter.

5. **Custom Hook**: Created `useTasks` hook to encapsulate all task-related state and API logic.

## Bonus Features Implemented

- ✅ Filter tasks by completed/incomplete status
- ✅ Edit existing task titles
- ✅ Task counts in filter buttons
- ✅ Loading states for all async operations
- ✅ Error handling with retry option
- ✅ Responsive design
- ✅ Dark/Light/System theme toggle
- ✅ Mock API mode (works without backend)

## Possible Improvements

- Add persistent storage (SQLite/PostgreSQL)
- Add unit/integration tests
- Add Docker setup for easy deployment
- Add task categories/tags
- Add due dates for tasks
- Add drag-and-drop reordering
