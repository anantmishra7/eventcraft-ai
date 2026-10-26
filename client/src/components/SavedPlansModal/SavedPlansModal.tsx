import React, { useRef } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useToast } from '../../context/ToastContext';
import { formatDate, formatINR } from '../../utils/formatters';
import { parsePlanJsonFile } from '../../utils/export';
import styles from './SavedPlansModal.module.css';

interface SavedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({ isOpen, onClose }) => {
  const { savedPlans, loadSavedPlan, deleteSavedPlan, importPlan } = usePlan();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const plan = await parsePlanJsonFile(file);
      importPlan(plan);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to import plan';
      showToast(msg, 'danger');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-modal-title"
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 id="saved-modal-title" className={styles.title}>
              Saved Celebration Plans
            </h2>
            <p className={styles.subtitle}>
              Manage plans stored locally or import a previously exported JSON plan.
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close saved plans dialog"
          >
            ✕
          </button>
        </div>

        {/* Import file section */}
        <div className={styles.importRow}>
          <span>Have an exported JSON plan file?</span>
          <button
            type="button"
            className={styles.importBtn}
            onClick={() => fileInputRef.current?.click()}
          >
            📥 Import Plan File (.json)
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".json,application/json"
            onChange={handleFileUpload}
          />
        </div>

        {/* List of plans */}
        <div className={styles.plansList}>
          {savedPlans.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon} aria-hidden="true">
                📭
              </span>
              <p>No saved plans yet. Create an event plan using the setup form above!</p>
            </div>
          ) : (
            savedPlans.map(plan => (
              <div key={plan.id} className={styles.planCard}>
                <div className={styles.cardMain}>
                  <div className={styles.cardHeader}>
                    <span className={styles.typeBadge}>{plan.eventInput.eventType}</span>
                    <h3 className={styles.planName}>{plan.eventInput.eventName}</h3>
                  </div>

                  <div className={styles.metaRow}>
                    <span>📅 {formatDate(plan.eventInput.date)}</span>
                    <span>📍 {plan.eventInput.city}</span>
                    <span>👥 {plan.eventInput.guestCount} Guests</span>
                    <span className={styles.budgetPill}>
                      {formatINR(plan.eventInput.totalBudget)}
                    </span>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.loadBtn}
                    onClick={() => {
                      loadSavedPlan(plan.id);
                      onClose();
                    }}
                  >
                    Open Plan
                  </button>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => deleteSavedPlan(plan.id)}
                    aria-label={`Delete ${plan.eventInput.eventName}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
