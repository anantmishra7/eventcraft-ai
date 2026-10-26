import React, { useState } from 'react';
import { usePlan, TabType } from './context/PlanContext';
import { Navbar } from './components/Navbar/Navbar';
import { EventForm } from './components/EventForm/EventForm';
import { BudgetTracker } from './components/BudgetTracker/BudgetTracker';
import { TimelineView } from './components/TimelineView/TimelineView';
import { VendorChecklist } from './components/VendorChecklist/VendorChecklist';
import { IdeasGallery } from './components/IdeasGallery/IdeasGallery';
import { ChatAssistant } from './components/ChatAssistant/ChatAssistant';
import { SkeletonLoader } from './components/SkeletonLoader/SkeletonLoader';
import { SavedPlansModal } from './components/SavedPlansModal/SavedPlansModal';
import { ExportModal } from './components/ExportModal/ExportModal';
import { ToastContainer } from './components/Toast/Toast';
import { formatDate, formatINR, getDaysUntil } from './utils/formatters';
import styles from './App.module.css';

export const App: React.FC = () => {
  const { currentPlan, isGenerating, activeTab, setActiveTab, resetCurrentPlan } = usePlan();

  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'budget', label: 'Budget Tracker', icon: '💰' },
    { key: 'timeline', label: 'Countdown Timeline', icon: '⏱️' },
    { key: 'vendors', label: 'Vendor Checklist', icon: '🤝' },
    { key: 'ideas', label: 'Creative Ideas', icon: '💡' },
  ];

  return (
    <div className={styles.appWrap}>
      <Navbar
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      <main id="main-content" className={styles.mainContainer} tabIndex={-1}>
        {/* Loading state with skeleton */}
        {isGenerating && <SkeletonLoader count={3} />}

        {/* Setup Form if no active plan and not generating */}
        {!isGenerating && !currentPlan && <EventForm />}

        {/* Active Plan Dashboard */}
        {!isGenerating && currentPlan && (
          <div className={styles.dashboard}>
            {/* Celebration Overview Banner */}
            <header className={styles.planBanner}>
              <div className={styles.bannerTop}>
                <div className={styles.titleArea}>
                  <div className={styles.typeBadgeRow}>
                    <span className={styles.eventTypeBadge}>
                      {currentPlan.eventInput.eventType.toUpperCase()}
                    </span>
                    <span className={styles.dateDaysBadge}>
                      ⏳ {getDaysUntil(currentPlan.eventInput.date)} Days Remaining
                    </span>
                  </div>
                  <h1 className={styles.planTitle}>{currentPlan.eventInput.eventName}</h1>
                </div>

                <div className={styles.bannerActions}>
                  <button
                    type="button"
                    className={styles.newPlanBtn}
                    onClick={resetCurrentPlan}
                    aria-label="Create a new celebration plan"
                  >
                    + New Plan
                  </button>
                </div>
              </div>

              {/* Quick Info Bar */}
              <div className={styles.infoStrip}>
                <div className={styles.infoPill}>
                  <span className={styles.infoLabel}>Event Date:</span>
                  <span className={styles.infoValue}>
                    {formatDate(currentPlan.eventInput.date)}
                  </span>
                </div>
                <div className={styles.infoPill}>
                  <span className={styles.infoLabel}>City:</span>
                  <span className={styles.infoValue}>{currentPlan.eventInput.city}</span>
                </div>
                <div className={styles.infoPill}>
                  <span className={styles.infoLabel}>Guest Count:</span>
                  <span className={styles.infoValue}>
                    {currentPlan.eventInput.guestCount} Guests
                  </span>
                </div>
                <div className={styles.infoPill}>
                  <span className={styles.infoLabel}>Total Budget:</span>
                  <span className={`${styles.infoValue} ${styles.budgetValue}`}>
                    {formatINR(currentPlan.eventInput.totalBudget)}
                  </span>
                </div>
              </div>

              {/* AI Strategic Summary */}
              {currentPlan.summary && (
                <div className={styles.summaryWrap}>
                  <span className={styles.summaryIcon} aria-hidden="true">
                    ✨
                  </span>
                  <p className={styles.summaryText}>{currentPlan.summary}</p>
                </div>
              )}
            </header>

            {/* Tab Navigation */}
            <nav className={styles.tabNavWrap} aria-label="Plan Sections">
              <div className={styles.tabList} role="tablist">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    id={`plan-tab-${tab.key}`}
                    aria-selected={activeTab === tab.key}
                    aria-controls={`plan-section-${tab.key}`}
                    className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <span aria-hidden="true">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* Active Tab View */}
            <section
              id={`plan-section-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`plan-tab-${activeTab}`}
              className={styles.tabContent}
            >
              {activeTab === 'overview' && (
                <div className={styles.overviewGrid}>
                  <div className={styles.overviewCol}>
                    <BudgetTracker />
                  </div>
                  <div className={styles.overviewCol}>
                    <TimelineView />
                  </div>
                </div>
              )}

              {activeTab === 'budget' && <BudgetTracker />}
              {activeTab === 'timeline' && <TimelineView />}
              {activeTab === 'vendors' && <VendorChecklist />}
              {activeTab === 'ideas' && <IdeasGallery />}
            </section>
          </div>
        )}
      </main>

      {/* AI Chat Assistant */}
      <ChatAssistant />

      {/* Modals */}
      <SavedPlansModal isOpen={isSavedModalOpen} onClose={() => setIsSavedModalOpen(false)} />

      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />

      {/* Accessible Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
