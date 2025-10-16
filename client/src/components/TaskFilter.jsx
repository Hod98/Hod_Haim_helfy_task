import styles from "../styles/TaskFilter.module.css";

export default function TaskFilter({ 
  statusFilter, 
  onStatusFilterChange, 
  priorityFilter, 
  onPriorityFilterChange,
  taskCounts 
}) {
  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Status</h3>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => onStatusFilterChange("all")}
            className={`${styles.filterButton} ${statusFilter === "all" ? styles.active : ""}`}
          >
            All ({taskCounts.all})
          </button>
          <button
            onClick={() => onStatusFilterChange("active")}
            className={`${styles.filterButton} ${statusFilter === "active" ? styles.active : ""}`}
          >
            Active ({taskCounts.active})
          </button>
          <button
            onClick={() => onStatusFilterChange("completed")}
            className={`${styles.filterButton} ${statusFilter === "completed" ? styles.active : ""}`}
          >
            Completed ({taskCounts.completed})
          </button>
        </div>
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Priority</h3>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => onPriorityFilterChange("all")}
            className={`${styles.filterButton} ${priorityFilter === "all" ? styles.active : ""}`}
          >
            All
          </button>
          <button
            onClick={() => onPriorityFilterChange("high")}
            className={`${styles.filterButton} ${styles.high} ${priorityFilter === "high" ? styles.active : ""}`}
          >
            High ({taskCounts.high})
          </button>
          <button
            onClick={() => onPriorityFilterChange("medium")}
            className={`${styles.filterButton} ${styles.medium} ${priorityFilter === "medium" ? styles.active : ""}`}
          >
            Medium ({taskCounts.medium})
          </button>
          <button
            onClick={() => onPriorityFilterChange("low")}
            className={`${styles.filterButton} ${styles.low} ${priorityFilter === "low" ? styles.active : ""}`}
          >
            Low ({taskCounts.low})
          </button>
        </div>
      </div>
    </div>
  );
}

