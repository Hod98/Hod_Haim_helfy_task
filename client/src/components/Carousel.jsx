import { useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import styles from "../styles/Carousel.module.css";

export default function Carousel({ items = [], onToggleDone, onDelete, onEdit, onMoveLeft, onMoveRight }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [items.length]);

  if (!items.length) {
    return (
      <div className={styles.emptyState}>
        No tasks yet.
      </div>
    );
  }

  const currentTask = items[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === items.length - 1;

  const handleMoveLeft = (task) => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      onMoveLeft?.(task);
    }
  };

  const handleMoveRight = (task) => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onMoveRight?.(task);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(items.length - 1);
    }
  };

  const next = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.positionIndicator}>
        <span className={styles.positionText}>
          {currentIndex + 1} of {items.length}
        </span>
      </div>

      <div className={styles.carouselWrapper}>
        <div 
          className={styles.carouselTrack}
          style={{
            '--current-index': currentIndex,
            '--items-count': items.length
          }}
        >
          {items.map((task, index) => (
            <div key={task.id} className={styles.carouselSlide}>
              <TaskCard
                task={task}
                onToggleDone={onToggleDone}
                onDelete={onDelete}
                onEdit={onEdit}
                onMoveLeft={handleMoveLeft}
                onMoveRight={handleMoveRight}
                isFirst={index === 0}
                isLast={index === items.length - 1}
              />
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <div className={styles.navigationButtons}>
          <button
            onClick={prev}
            className={styles.navButton}
          >
            ← Prev
          </button>

          <button
            onClick={next}
            className={styles.navButton}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
  