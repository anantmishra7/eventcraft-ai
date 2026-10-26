import React, { useMemo } from 'react';
import { usePlan } from '../../context/PlanContext';
import { formatINR, formatPercentage } from '../../utils/formatters';
import { BUDGET_CATEGORIES } from '@eventcraft/shared';
import styles from './BudgetTracker.module.css';

export const BudgetTracker: React.FC = () => {
  const { currentPlan, updateBudgetItem } = usePlan();

  if (!currentPlan) return null;

  const totalBudget = currentPlan.eventInput.totalBudget;

  // Memoized computations for efficiency
  const { totalSpent, remainingBudget, isOverBudget } = useMemo(() => {
    const allocated = currentPlan.budgetBreakdown.reduce(
      (sum, item) => sum + item.allocatedAmount,
      0,
    );
    const spent = currentPlan.budgetBreakdown.reduce(
      (sum, item) => sum + (item.actualSpent || 0),
      0,
    );
    const remaining = totalBudget - spent;
    return {
      totalAllocated: allocated,
      totalSpent: spent,
      remainingBudget: remaining,
      isOverBudget: remaining < 0,
    };
  }, [currentPlan.budgetBreakdown, totalBudget]);

  const spentPercentage = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

  return (
    <div className={styles.container}>
      {/* Overview Metric Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Budget</span>
          <span className={styles.statValue}>{formatINR(totalBudget)}</span>
          <span className={styles.statSub}>100% Target</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Actual Spent</span>
          <span
            className={`${styles.statValue} ${isOverBudget ? styles.dangerText : styles.primaryText}`}
          >
            {formatINR(totalSpent)}
          </span>
          <span className={styles.statSub}>{spentPercentage}% of total budget</span>
        </div>

        <div className={`${styles.statCard} ${isOverBudget ? styles.overBudgetCard : ''}`}>
          <span className={styles.statLabel}>Remaining Balance</span>
          <span
            className={`${styles.statValue} ${isOverBudget ? styles.dangerText : styles.successText}`}
            aria-live="polite"
          >
            {formatINR(remainingBudget)}
          </span>
          <span className={styles.statSub}>
            {isOverBudget ? '⚠️ Deficit Alert' : 'Available to spend'}
          </span>
        </div>
      </div>

      {/* Over-Budget Alert Banner */}
      {isOverBudget && (
        <div className={styles.alertBanner} role="alert" aria-live="assertive">
          <span className={styles.alertIcon} aria-hidden="true">
            🚨
          </span>
          <div className={styles.alertContent}>
            <strong>Budget Exceeded by {formatINR(Math.abs(remainingBudget))}!</strong>
            <p>
              Your actual expenses exceed your target budget. Use the AI Assistant to rebalance
              allocations or reduce expenses in other categories.
            </p>
          </div>
        </div>
      )}

      {/* Overall Progress Bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressTitle}>Budget Utilization</span>
          <span className={styles.progressRatio}>
            {formatINR(totalSpent)} / {formatINR(totalBudget)} (
            {formatPercentage(totalSpent, totalBudget)})
          </span>
        </div>
        <div
          className={styles.progressBarTrack}
          role="progressbar"
          aria-valuenow={spentPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Overall budget utilization"
        >
          <div
            className={`${styles.progressBarFill} ${isOverBudget ? styles.dangerFill : ''}`}
            style={{ width: `${spentPercentage}%` }}
          />
        </div>
      </div>

      {/* Category Breakdown Table / Cards */}
      <div className={styles.breakdownCard}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Category Allocations & Live Expense Tracking</h2>
            <p className={styles.cardDesc}>
              Allocated amounts are engineered by GenAI. You can update your "Actual Spent" for each
              category to track real expenses.
            </p>
          </div>
        </div>

        <div className={styles.categoryList}>
          {currentPlan.budgetBreakdown.map(item => {
            const categoryMeta = BUDGET_CATEGORIES.find(c => c.key === item.category);
            const categorySpent = item.actualSpent || 0;
            const categoryRemaining = item.allocatedAmount - categorySpent;
            const categoryPct = Math.min(
              100,
              Math.round((categorySpent / (item.allocatedAmount || 1)) * 100),
            );
            const categoryOver = categoryRemaining < 0;

            return (
              <div key={item.id} className={styles.categoryRow}>
                <div className={styles.catLeft}>
                  <span className={styles.catIcon} aria-hidden="true">
                    {categoryMeta?.icon || '🏷️'}
                  </span>
                  <div className={styles.catInfo}>
                    <div className={styles.catNameWrap}>
                      <span className={styles.catName}>{item.name}</span>
                      <span className={styles.pctPill}>{item.percentage}% allocated</span>
                    </div>
                    <span className={styles.catNotes}>{item.notes}</span>
                  </div>
                </div>

                <div className={styles.catRight}>
                  {/* Allocated */}
                  <div className={styles.metricBlock}>
                    <span className={styles.metricLabel}>Allocated</span>
                    <span className={styles.metricValue}>{formatINR(item.allocatedAmount)}</span>
                  </div>

                  {/* Actual Spent Input */}
                  <div className={styles.metricBlock}>
                    <label htmlFor={`spent-${item.id}`} className={styles.metricLabel}>
                      Actual Spent (INR)
                    </label>
                    <input
                      id={`spent-${item.id}`}
                      type="number"
                      min="0"
                      step="500"
                      className={`${styles.spentInput} ${categoryOver ? styles.inputWarning : ''}`}
                      value={item.actualSpent === 0 ? '' : item.actualSpent}
                      placeholder="₹0"
                      onChange={e =>
                        updateBudgetItem(
                          item.id,
                          e.target.value === '' ? 0 : Number(e.target.value),
                        )
                      }
                      aria-label={`Actual spent for ${item.name}`}
                    />
                  </div>

                  {/* Category Progress mini-bar */}
                  <div className={styles.miniProgressWrap}>
                    <span className={styles.metricLabel}>
                      {categoryOver ? (
                        <span className={styles.dangerText}>
                          Over by {formatINR(Math.abs(categoryRemaining))}
                        </span>
                      ) : (
                        <span>Rem: {formatINR(categoryRemaining)}</span>
                      )}
                    </span>
                    <div
                      className={styles.miniTrack}
                      role="progressbar"
                      aria-valuenow={categoryPct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className={`${styles.miniFill} ${categoryOver ? styles.dangerFill : ''}`}
                        style={{ width: `${categoryPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
