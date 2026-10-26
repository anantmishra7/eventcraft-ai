import React from 'react';
import styles from './SkeletonLoader.module.css';

interface SkeletonProps {
  type?: 'card' | 'budget' | 'timeline' | 'text';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ type = 'card', count = 3 }) => {
  return (
    <div
      className={styles.skeletonContainer}
      role="status"
      aria-label="Generating personalized event plan with AI, please wait..."
      aria-busy="true"
    >
      <div className={styles.loadingBanner}>
        <div className={styles.spinner} aria-hidden="true" />
        <div>
          <h3 className={styles.loadingTitle}>EventCraft GenAI is planning your celebration...</h3>
          <p className={styles.loadingSub}>
            Analyzing venue rates, optimizing INR budget breakdown, scheduling countdown tasks, and
            curating creative ideas.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className={`${styles.skeletonCard} ${styles[type]}`}>
            <div className={styles.shimmerLine} style={{ width: '60%', height: '24px' }} />
            <div className={styles.shimmerLine} style={{ width: '90%', height: '16px' }} />
            <div className={styles.shimmerLine} style={{ width: '75%', height: '16px' }} />
            <div className={styles.shimmerBox} style={{ height: '80px' }} />
          </div>
        ))}
      </div>
    </div>
  );
};
