import React, { useState, useMemo } from 'react';
import { usePlan } from '../../context/PlanContext';
import { formatDate, getDaysUntil } from '../../utils/formatters';
import styles from './TimelineView.module.css';

export const TimelineView: React.FC = () => {
  const { currentPlan, toggleTask } = usePlan();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  if (!currentPlan) return null;

  const tasks = currentPlan.timeline;

  const { completedCount, totalCount, progressPercent } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completedCount: completed, totalCount: total, progressPercent: percent };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === 'pending') return tasks.filter(t => !t.completed);
    if (filter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  }, [tasks, filter]);

  return (
    <div className={styles.container}>
      {/* Progress Card */}
      <div className={styles.progressCard}>
        <div className={styles.progressTop}>
          <div>
            <h2 className={styles.title}>Milestone Countdown Timeline</h2>
            <p className={styles.subtitle}>
              Week-by-week and month-by-month checkpoints leading up to{' '}
              <strong>{formatDate(currentPlan.eventInput.date)}</strong> (
              {getDaysUntil(currentPlan.eventInput.date)} days away).
            </p>
          </div>
          <div className={styles.progressMetric}>
            <span className={styles.percentText}>{progressPercent}%</span>
            <span className={styles.countText}>
              {completedCount} of {totalCount} Completed
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className={styles.track}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Timeline task completion progress"
        >
          <div className={styles.fill} style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Filters */}
        <div className={styles.filterBar} role="group" aria-label="Filter tasks">
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === 'all' ? styles.filterActive : ''}`}
            onClick={() => setFilter('all')}
          >
            All Tasks ({totalCount})
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === 'pending' ? styles.filterActive : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({totalCount - completedCount})
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === 'completed' ? styles.filterActive : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Timeline List */}
      <div className={styles.timelineList}>
        {filteredTasks.length === 0 ? (
          <div className={styles.emptyState}>No tasks found matching this filter.</div>
        ) : (
          filteredTasks.map(task => (
            <article
              key={task.id}
              className={`${styles.taskItem} ${task.completed ? styles.taskCompleted : ''}`}
            >
              <div className={styles.checkCol}>
                <input
                  type="checkbox"
                  id={`task-${task.id}`}
                  className={styles.checkbox}
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  aria-label={`Mark "${task.title}" as ${task.completed ? 'pending' : 'completed'}`}
                />
              </div>

              <div className={styles.contentCol}>
                <div className={styles.badgeRow}>
                  <span className={styles.timeframeBadge}>{task.timeframe}</span>
                  <span className={`${styles.priorityBadge} ${styles[task.priority]}`}>
                    {task.priority} priority
                  </span>
                  <span className={styles.categoryBadge}>{task.category}</span>
                  {task.dueDate && (
                    <span className={styles.dueDateBadge}>📅 Due: {formatDate(task.dueDate)}</span>
                  )}
                </div>

                <label htmlFor={`task-${task.id}`} className={styles.taskTitle}>
                  {task.title}
                </label>
                {task.description && <p className={styles.taskDescription}>{task.description}</p>}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
