import { useState } from "react";
import styles from "../styles/AddTaskForm.module.css";

export default function AddTaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const disabled = loading || !title.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description, priority }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const created = await res.json();
      onCreate?.(created);       // Pass the new item to parent
      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (err) {
      console.error("Create failed:", err);
      alert("Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        placeholder="Task title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.input}
      />
     <textarea
         placeholder="Description (optional)…"
         value={description}
         onChange={(e) => setDescription(e.target.value)}
         rows={3}
         className={styles.textarea}
      />
      
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className={styles.select}
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
      
   <button 
     disabled={disabled} 
     type="submit"
     className={styles.button}
   >
     {loading ? "Adding…" : "Add Task"}
   </button>
    </form>
  );
}
