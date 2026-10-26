import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import styles from './IdeasGallery.module.css';

type IdeaTab = 'themes' | 'decor' | 'menu' | 'activities' | 'returnGifts';

export const IdeasGallery: React.FC = () => {
  const { currentPlan } = usePlan();
  const [activeSubTab, setActiveSubTab] = useState<IdeaTab>('themes');

  if (!currentPlan) return null;

  const { personalizedIdeas, proTips } = currentPlan;

  const tabs: { key: IdeaTab; label: string; icon: string; count: number }[] = [
    {
      key: 'themes',
      label: 'Themes & Aesthetics',
      icon: '🎨',
      count: personalizedIdeas.themes.length,
    },
    { key: 'decor', label: 'Decor Concepts', icon: '✨', count: personalizedIdeas.decor.length },
    { key: 'menu', label: 'Gourmet Menu', icon: '🍽️', count: personalizedIdeas.menu.length },
    {
      key: 'activities',
      label: 'Activities & Games',
      icon: '🎪',
      count: personalizedIdeas.activities.length,
    },
    {
      key: 'returnGifts',
      label: 'Return Favors',
      icon: '🎁',
      count: personalizedIdeas.returnGifts.length,
    },
  ];

  const currentItems = personalizedIdeas[activeSubTab] || [];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Personalized Creative Ideas</h2>
        <p className={styles.subtitle}>
          Curated specifically for <strong>{currentPlan.eventInput.eventName}</strong> (
          {currentPlan.eventInput.city}) reflecting "
          {currentPlan.eventInput.themePreferences || 'Celebration'}".
        </p>
      </div>

      {/* Sub-tab navigation */}
      <div className={styles.tabsNav} role="tablist" aria-label="Creative idea categories">
        {tabs.map(tab => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeSubTab === tab.key}
            aria-controls={`panel-${tab.key}`}
            id={`tab-${tab.key}`}
            className={`${styles.tabBtn} ${activeSubTab === tab.key ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveSubTab(tab.key)}
          >
            <span aria-hidden="true">{tab.icon}</span>
            <span>{tab.label}</span>
            <span className={styles.tabCount}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Ideas Card Grid */}
      <div
        id={`panel-${activeSubTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeSubTab}`}
        className={styles.ideasGrid}
      >
        {currentItems.map((item, idx) => (
          <div key={idx} className={styles.ideaCard}>
            <div className={styles.ideaNumber}>#{idx + 1}</div>
            <p className={styles.ideaText}>{item}</p>
          </div>
        ))}
      </div>

      {/* Planner Pro Tips Banner */}
      {proTips && proTips.length > 0 && (
        <div className={styles.proTipsCard}>
          <div className={styles.proTipsHeader}>
            <span className={styles.proTipsIcon} aria-hidden="true">
              💡
            </span>
            <h3 className={styles.proTipsTitle}>EventCraft Strategist Pro Tips</h3>
          </div>
          <ul className={styles.proTipsList}>
            {proTips.map((tip, idx) => (
              <li key={idx} className={styles.proTipItem}>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
