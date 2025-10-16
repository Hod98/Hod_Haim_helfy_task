import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} from "../lib/fsdb.js";

export const tasksRouter = Router();

// Get all tasks
tasksRouter.get("/", async (req, res, next) => {
  try {
    const items = await getTasks();
    res.json(items);
  } catch (err) {
    next(err);
  }
});
// Create new task
tasksRouter.post("/", async (req, res, next) => {
  try {
    const { title, description, priority } = req.body || {};
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "title is required" });
    }

    const task = await createTask({ title: title.trim(), description: description ?? "", priority: priority ?? "medium" });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// Toggle completion status
tasksRouter.patch("/:id/toggle", async (req, res, next) => {
  try {
    const items = await getTasks();
    const task = items.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: "not_found" });
    
    const updated = await updateTask(req.params.id, { 
      completed: !task.completed 
    });
    
    if (!updated) return res.status(404).json({ error: "not_found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Update task fields
tasksRouter.patch("/:id", async (req, res, next) => {
  try {
    const updated = await updateTask(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ error: "not_found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Full task update
tasksRouter.put("/:id", async (req, res, next) => {
  try {
    const updated = await updateTask(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ error: "not_found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete a task
tasksRouter.delete("/:id", async (req, res, next) => {
  try {
    const ok = await deleteTask(req.params.id);
    if (!ok) return res.status(404).json({ error: "not_found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Reorder tasks
tasksRouter.put("/reorder", async (req, res, next) => {
  try {
    const arr = Array.isArray(req.body) ? req.body : [];
    const updated = await reorderTasks(arr);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});
