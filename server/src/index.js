import express from "express";
import cors from "cors";
import { tasksRouter } from "./routes/tasks.js";


const app = express();
app.use(cors());
app.use(express.json());

// Checkpoint
app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "todo-api" });
});


app.use("/api/tasks", tasksRouter);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
