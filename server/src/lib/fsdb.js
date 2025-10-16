// server/src/lib/fsdb.js
import { readFile, writeFile } from "fs/promises";
import { randomUUID } from "crypto";

// Path to tasks JSON file
const DATA_PATH = new URL("../data/tasks.json", import.meta.url);
const now = () => Date.now();

// Read tasks from file
async function readAll() {
  try {
    const buf = await readFile(DATA_PATH, "utf-8");      // Read text (not Buffer)
    const items = JSON.parse(buf);                        // Convert to JS
    if (!Array.isArray(items)) throw new Error("bad_json_root_not_array");
    return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)); // Consistent order
  } catch (err) {
    if (err?.code === "ENOENT") {
      // No file? Create an empty one
      await writeAll([]);
      return [];
    }
    // Broken JSON or any other error - reset to empty file so system doesn't crash
    console.error("readAll error:", err);
    await writeAll([]);
    return [];
  }
}

// Write tasks to file
async function writeAll(items) {
  try {
    const pretty = JSON.stringify(items, null, 2);
    await writeFile(DATA_PATH, pretty, "utf-8");
    return items;
  } catch (err) {
    console.error("writeAll error:", err);
    // Throw error so API returns 500 and client knows writing failed
    throw new Error("write_failed");
  }
}

// Get all tasks
export async function getTasks() {
  return readAll();
}

// Create new task
export async function createTask({ title, description = "", priority = "medium" }) {
  try {
    const items = await readAll();
    const id = randomUUID();
    const ts = now();
    const maxOrder = items.length ? Math.max(...items.map(i => i.order ?? 0)) : -1;
    const newTask = {
        id,
        title,
        description,
        completed: false,
        priority,
        order: maxOrder + 1,
        createdAt: ts,
        updatedAt: ts,
    };
    const next = [...items, newTask];
    await writeAll(next);
    return newTask;
  } catch (err) {
    console.error("createTask error:", err);
    throw new Error("create_failed");
  }
}

// Update task
export async function updateTask(id, patch) {
  try {
    const items = await readAll();
    const idx = items.findIndex(t => t.id === id);
    if (idx === -1) return null;

    const safePatch = {};
    if (typeof patch.title === "string") safePatch.title = patch.title;
    if (typeof patch.description === "string") safePatch.description = patch.description;
    if (typeof patch.completed === "boolean") safePatch.completed = patch.completed;
    if (patch.priority === "low" || patch.priority === "medium" || patch.priority === "high") {
      safePatch.priority = patch.priority;
    }
    if (Number.isFinite(patch?.order)) safePatch.order = Number(patch.order);

    const updated = { ...items[idx], ...safePatch, updatedAt: now() };
    const next = [...items];
    next[idx] = updated;

    // If order was updated, stabilize final order before writing
    if (safePatch.hasOwnProperty("order")) {
      next.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    await writeAll(next);
    return updated;
  } catch (err) {
    console.error("updateTask error:", err);
    throw new Error("update_failed");
  }
}

// Delete task
export async function deleteTask(id) {
  try {
    const items = await readAll();
    const next = items.filter(t => t.id !== id);
    if (next.length === items.length) return false; // Not found
    await writeAll(next);
    return true;
  } catch (err) {
    console.error("deleteTask error:", err);
    throw new Error("delete_failed");
  }
}

// Reorder tasks based on new order array
export async function reorderTasks(newOrder) {
  try {
    const plan = Array.isArray(newOrder) ? newOrder : [];
    const desired = new Map(
      plan
        .filter(x => x && typeof x.id === "string" && Number.isFinite(x.order))
        .map(x => [x.id, Number(x.order)])
    );

    const items = await readAll();
    const next = items.map(t =>
      desired.has(t.id)
        ? { ...t, order: desired.get(t.id), updatedAt: now() }
        : t
    );

    // Ensure consistent and dense order (0..n-1) to prevent gaps, but only if desired:
    next.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    await writeAll(next);
    return next;
  } catch (err) {
    console.error("reorderTasks error:", err);
    throw new Error("reorder_failed");
  }
}
  