import { useState } from "react";
import styles from "../styles/TaskCard.module.css";

export default function TaskCard({
    task,
    onToggleDone,
    onDelete,
    onEdit,
    onMoveLeft,
    onMoveRight,
    isFirst,
    isLast,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  
  return (
    <>
    <article className={styles.card}>
        <h3 className={`${styles.title} ${task.completed ? styles.completed : ""}`}>
            {task.title}
        </h3>
        <p className={styles.description}>{task.description || "—"}</p>
        <div className={styles.statusContainer}>
          <span className={`${styles.statusBadge} ${task.completed ? styles.completed : styles.pending}`}>
            <span className={`${styles.statusDot} ${task.completed ? styles.completed : styles.pending}`}></span>
            {task.completed ? "Completed" : "Pending"}
          </span>
          <span className={styles.orderNumber}>
            #{task.order + 1}
          </span>
        </div>
  
        <div className={styles.buttonContainer}>
              <button
                    onClick={() => onEdit?.(task)}
                    className={`${styles.button} ${styles.editButton}`}
                  >
                    Edit
              </button>
              <button
                onClick={() => onToggleDone?.(task)}
                className={`${styles.button} ${styles.toggleButton}`}
              >
                {task.completed ? "Mark Undone" : "Mark Done"}
              </button>
              <button
                     onClick={() => onDelete?.(task)}
                     className={`${styles.button} ${styles.deleteButton}`}
                   >
                     Delete
              </button>
        </div>
      </article>
      
      {/* Completion Animation */}
      {showCheckmark && (
        <div className={styles.checkmarkAnimation}>
          ✓
        </div>
      )}
    </>
    );
  }
  