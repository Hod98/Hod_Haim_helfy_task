# Task Manager with Carousel

This is a fullstack task manager app I built using React and Node.js. It shows one task at a time in a carousel view.

## What it does

- Add new tasks with title, description, and priority
- Edit existing tasks
- Delete tasks
- Mark tasks as done/not done
- Filter tasks by status (all, active, completed)
- Filter by priority (high, medium, low)
- Navigate between tasks using prev/next buttons
- The carousel wraps around (endless loop)

## Technologies

Frontend: React, Vite, CSS Modules
Backend: Node.js, Express
Database: JSON file storage

## Folder Structure

```
todo-carousel-fullstack/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── styles/
│   │   └── App.jsx
│   └── package.json
├── server/          # Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── lib/
│   │   └── data/
│   └── package.json
└── README.md
```

## Setup

1. Clone this repo
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

2. Install dependencies for server
```bash
cd server
npm install
```

3. Install dependencies for client
```bash
cd ../client
npm install
```

## Running the app

Start the server (open one terminal):
```bash
cd server
npm run dev
```
The server runs on http://localhost:4000

Start the client (open another terminal):
```bash
cd client
npm run dev
```
The client runs on http://localhost:5173

## API Routes

The backend has these routes:
- GET /api/tasks - get all tasks
- POST /api/tasks - create new task
- PUT /api/tasks/:id - update a task
- PATCH /api/tasks/:id - partial update
- PATCH /api/tasks/:id/toggle - toggle done status
- DELETE /api/tasks/:id - delete a task
- PUT /api/tasks/reorder - change task order

## Task Structure

Each task object looks like this:
```json
{
  "id": "uuid",
  "title": "Task title",
  "description": "Optional description",
  "completed": false,
  "priority": "low" | "medium" | "high",
  "order": 0,
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

