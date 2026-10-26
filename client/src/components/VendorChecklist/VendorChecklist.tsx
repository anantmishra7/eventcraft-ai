import React, { useMemo } from 'react';
import { usePlan } from '../../context/PlanContext';
import { formatINR } from '../../utils/formatters';
import styles from './VendorChecklist.module.css';

export const VendorChecklist: React.FC = () => {
  const { currentPlan, toggleVendor } = usePlan();

  if (!currentPlan) return null;

  const vendors = currentPlan.vendorChecklist;

  const { bookedCount, totalCount, bookedPercent } = useMemo(() => {
    const total = vendors.length;
    const booked = vendors.filter(v => v.booked).length;
    const pct = total > 0 ? Math.round((booked / total) * 100) : 0;
    return { bookedCount: booked, totalCount: total, bookedPercent: pct };
  }, [vendors]);

  return (
    <div className={styles.container}>
      {/* Booking Status Card */}
      <div className={styles.summaryCard}>
        <div className={styles.summaryTop}>
          <div>
            <h2 className={styles.title}>Vendor Verification & Booking Checklist</h2>
            <p className={styles.subtitle}>
              Essential vendor categories for {currentPlan.eventInput.city}. Use the tailored
              inquiry questions to negotiate terms and avoid hidden charges.
            </p>
          </div>
          <div className={styles.metric}>
            <span className={styles.percentText}>{bookedPercent}%</span>
            <span className={styles.countText}>
              {bookedCount} of {totalCount} Booked
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className={styles.track}
          role="progressbar"
          aria-valuenow={bookedPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Vendor booking progress"
        >
          <div className={styles.fill} style={{ width: `${bookedPercent}%` }} />
        </div>
      </div>

      {/* Vendors List */}
      <div className={styles.vendorGrid}>
        {vendors.map(vendor => (
          <article
            key={vendor.id}
            className={`${styles.vendorCard} ${vendor.booked ? styles.vendorBooked : ''}`}
          >
            <div className={styles.cardHeader}>
              <div className={styles.headerLeft}>
                <span className={styles.categoryBadge}>{vendor.category}</span>
                <h3 className={styles.vendorName}>{vendor.name}</h3>
              </div>

              <div className={styles.bookCheckWrap}>
                <label className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={vendor.booked}
                    onChange={() => toggleVendor(vendor.id)}
                    aria-label={`Mark ${vendor.name} as ${vendor.booked ? 'not booked' : 'booked'}`}
                  />
                  <span className={styles.checkText}>{vendor.booked ? 'Booked ✓' : 'Pending'}</span>
                </label>
              </div>
            </div>

            {/* Estimated Price Range */}
            <div className={styles.costRange}>
              <span className={styles.costLabel}>Estimated Cost Range:</span>
              <span className={styles.costValue}>
                {formatINR(vendor.estimatedCostMin)} – {formatINR(vendor.estimatedCostMax)}
              </span>
            </div>

            {/* Questions to Ask */}
            <div className={styles.questionsSection}>
              <span className={styles.questionsTitle}>What to Ask & Verify:</span>
              <ul className={styles.questionsList}>
                {vendor.questionsToAsk.map((q, idx) => (
                  <li key={idx} className={styles.questionItem}>
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            {/* Notes */}
            {vendor.contactNotes && (
              <div className={styles.notesWrap}>
                <span className={styles.notesLabel}>Notes / Status:</span>
                <p className={styles.notesText}>{vendor.contactNotes}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};
