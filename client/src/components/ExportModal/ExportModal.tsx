import React from 'react';
import { usePlan } from '../../context/PlanContext';
import { downloadPlanJson, printPlanView } from '../../utils/export';
import { formatDate, formatINR } from '../../utils/formatters';
import styles from './ExportModal.module.css';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { currentPlan } = usePlan();

  if (!isOpen || !currentPlan) return null;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h2 id="export-modal-title" className={styles.title}>
              Export & Share Celebration Plan
            </h2>
            <p className={styles.subtitle}>
              Download structured data for offline backup or generate a clean print/PDF view for
              vendors and family.
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close export dialog"
          >
            ✕
          </button>
        </div>

        {/* Plan Snapshot */}
        <div className={styles.planSnapshot}>
          <div className={styles.snapshotRow}>
            <span className={styles.snapshotLabel}>Event:</span>
            <strong>{currentPlan.eventInput.eventName}</strong>
          </div>
          <div className={styles.snapshotRow}>
            <span className={styles.snapshotLabel}>Date & City:</span>
            <span>
              {formatDate(currentPlan.eventInput.date)} ({currentPlan.eventInput.city})
            </span>
          </div>
          <div className={styles.snapshotRow}>
            <span className={styles.snapshotLabel}>Total Budget:</span>
            <span>{formatINR(currentPlan.eventInput.totalBudget)}</span>
          </div>
          <div className={styles.snapshotRow}>
            <span className={styles.snapshotLabel}>Content:</span>
            <span>
              {currentPlan.budgetBreakdown.length} Budget Categories, {currentPlan.timeline.length}{' '}
              Countdown Tasks, {currentPlan.vendorChecklist.length} Vendors
            </span>
          </div>
        </div>

        {/* Action Options */}
        <div className={styles.optionsGrid}>
          {/* Print / PDF Option */}
          <div className={styles.optionCard}>
            <div className={styles.optionIcon} aria-hidden="true">
              🖨️
            </div>
            <div className={styles.optionContent}>
              <h3 className={styles.optionTitle}>Print-Friendly / Save as PDF</h3>
              <p className={styles.optionDesc}>
                Generates a clean black-and-white, pagination-friendly layout for desktop printing
                or PDF export.
              </p>
            </div>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => {
                onClose();
                setTimeout(() => printPlanView(), 150);
              }}
            >
              Open Print / PDF View
            </button>
          </div>

          {/* JSON Option */}
          <div className={styles.optionCard}>
            <div className={styles.optionIcon} aria-hidden="true">
              💾
            </div>
            <div className={styles.optionContent}>
              <h3 className={styles.optionTitle}>Export as JSON File</h3>
              <p className={styles.optionDesc}>
                Downloads the full structured JSON plan. Useful for re-importing into EventCraft AI
                on any device.
              </p>
            </div>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => {
                downloadPlanJson(currentPlan);
                onClose();
              }}
            >
              Download JSON File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
