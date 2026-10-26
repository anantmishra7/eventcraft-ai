import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { usePlan } from '../../context/PlanContext';
import styles from './Navbar.module.css';

interface NavbarProps {
  onOpenSavedModal: () => void;
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSavedModal, onOpenExportModal }) => {
  const { theme, toggleTheme } = useTheme();
  const { currentPlan, savedPlans, isDemoMode, loadDemoPlan, resetCurrentPlan } = usePlan();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand */}
        <div className={styles.brandGroup}>
          <button
            type="button"
            className={styles.brandBtn}
            onClick={resetCurrentPlan}
            aria-label="EventCraft AI Home - Create or view event plans"
          >
            <span className={styles.logoIcon} aria-hidden="true">
              ✨
            </span>
            <div className={styles.titleWrap}>
              <span className={styles.brandTitle}>EventCraft AI</span>
              <span className={styles.brandSub}>Celebration & Event Planner</span>
            </div>
          </button>

          {isDemoMode && (
            <span
              className={styles.demoBadge}
              title="Running in Demo Mode. Real-time plan generation using curated data engine."
            >
              Demo Mode
            </span>
          )}
        </div>

        {/* Quick Actions & Controls */}
        <div className={styles.actionGroup}>
          {/* Demo Presets for quick evaluation */}
          <div className={styles.presetGroup}>
            <button
              type="button"
              className={styles.presetBtn}
              onClick={() => loadDemoPlan('wedding')}
              aria-label="Load Showcase Wedding Plan"
            >
              👑 Wedding
            </button>
            <button
              type="button"
              className={styles.presetBtn}
              onClick={() => loadDemoPlan('birthday')}
              aria-label="Load Showcase Birthday Plan"
            >
              🎈 Birthday
            </button>
          </div>

          {/* Saved Plans */}
          <button
            type="button"
            className={styles.navBtn}
            onClick={onOpenSavedModal}
            aria-label={`View saved plans. ${savedPlans.length} plans stored.`}
          >
            📂 Saved
            {savedPlans.length > 0 && <span className={styles.badge}>{savedPlans.length}</span>}
          </button>

          {/* Export / Print */}
          {currentPlan && (
            <button
              type="button"
              className={styles.navBtn}
              onClick={onOpenExportModal}
              aria-label="Export or Print current event plan"
            >
              📤 Export / Print
            </button>
          )}

          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
};
