import { useEffect, useState, useMemo } from "react";
import Carousel from "./components/Carousel";
import AddTaskForm from "./components/AddTaskForm";
import EditTaskForm from "./components/EditTaskForm";
import TaskFilter from "./components/TaskFilter";
import styles from "./styles/App.module.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, completed
  const [priorityFilter, setPriorityFilter] = useState("all"); // all, high, medium, low

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Fetch /api/tasks failed:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = (created) => {
    setTasks((prev) => [...prev, created].sort((a, b) => a.order - b.order));
  };

  const handleToggleDone = async (task) => {
    const updated = { ...task, completed: !task.completed };
    setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
    
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: updated.completed }),
      });
      if (!res.ok) throw new Error("Failed to toggle");
    } catch (err) {
      console.error(err);
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    }
  };

  const handleDelete = async (task) => {
    if (!confirm(`Delete "${task.title}"?`)) return;
    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      if (res.status !== 204) throw new Error(`HTTP ${res.status}`);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (e) {
      console.error("delete failed:", e);
      alert("Delete failed");
    }
  };

  const sendReorder = async (arr) => {
    const res = await fetch("/api/tasks/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(arr),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  const reorderBySwap = async (id, dir) => {
    let localItems;
    let shouldUpdate = false;
    
    setTasks((prev) => {
      const items = [...prev].sort((a, b) => a.order - b.order);
      const idx = items.findIndex((t) => t.id === id);
      if (idx < 0) return prev;
      
      const target = idx + dir;
      if (target < 0 || target >= items.length) return prev;

        // Local swap
      [items[idx], items[target]] = [items[target], items[idx]];
      const normalized = items.map((t, i) => ({ ...t, order: i }));
      localItems = normalized;
      shouldUpdate = true;
      return normalized;
    });

    if (!shouldUpdate) return; // No change needed

    try {
      const plan = localItems.map((t) => ({ id: t.id, order: t.order }));
      const updated = await sendReorder(plan);
        setTasks(updated); // Truth from server
    } catch (e) {
      console.error("reorder failed:", e);
      alert("Reorder failed");
      // Reload tasks from server to restore correct state
      try {
        const res = await fetch("/api/tasks");
        if (res.ok) {
          const tasks = await res.json();
          setTasks(tasks);
        }
      } catch (fetchError) {
        console.error("Failed to reload tasks:", fetchError);
      }
    }
  };

  const handleMoveLeft  = (task) => reorderBySwap(task.id, -1);
  const handleMoveRight = (task) => reorderBySwap(task.id, +1);

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleEditSave = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
  };

  const handleEditCancel = () => {
    setEditingTask(null);
  };

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply status filter
    if (statusFilter === "active") {
      filtered = filtered.filter(t => !t.completed);
    } else if (statusFilter === "completed") {
      filtered = filtered.filter(t => t.completed);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    return filtered;
  }, [tasks, statusFilter, priorityFilter]);

  const taskCounts = useMemo(() => {
    return {
      all: tasks.length,
      active: tasks.filter(t => !t.completed).length,
      completed: tasks.filter(t => t.completed).length,
      high: tasks.filter(t => t.priority === "high").length,
      medium: tasks.filter(t => t.priority === "medium").length,
      low: tasks.filter(t => t.priority === "low").length,
    };
  }, [tasks]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
      <h1 className={styles.title}>My Task Manager</h1>
        <AddTaskForm onCreate={handleCreate} />
        
        <TaskFilter
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          taskCounts={taskCounts}
        />
        
      {loading ? (
        <p className={styles.loading}>Loading…</p>
      ) : (
        <Carousel
          items={filteredTasks}
          onToggleDone={handleToggleDone}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onMoveLeft={handleMoveLeft}
          onMoveRight={handleMoveRight}
        />
      )}
      </div>
      
      {editingTask && (
        <EditTaskForm
          task={editingTask}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      )}
    </main>
  );
}
