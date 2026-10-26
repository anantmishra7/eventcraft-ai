import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EventPlan, EventSetupInput } from '@eventcraft/shared';
import { api } from '../services/api';
import { useToast } from './ToastContext';

export type TabType = 'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas';

interface PlanContextType {
  currentPlan: EventPlan | null;
  savedPlans: EventPlan[];
  isGenerating: boolean;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  createPlan: (input: EventSetupInput) => Promise<void>;
  updatePlan: (plan: EventPlan) => void;
  updateBudgetItem: (id: string, actualSpent: number) => void;
  toggleTask: (id: string) => void;
  toggleVendor: (id: string) => void;
  loadSavedPlan: (id: string) => void;
  deleteSavedPlan: (id: string) => void;
  loadDemoPlan: (type: 'wedding' | 'birthday') => Promise<void>;
  importPlan: (plan: EventPlan) => void;
  resetCurrentPlan: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [currentPlan, setCurrentPlan] = useState<EventPlan | null>(() => {
    try {
      const saved = localStorage.getItem('eventcraft_active_plan');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [savedPlans, setSavedPlans] = useState<EventPlan[]>(() => {
    try {
      const saved = localStorage.getItem('eventcraft_saved_plans');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Sync current plan to localStorage
  useEffect(() => {
    try {
      if (currentPlan) {
        localStorage.setItem('eventcraft_active_plan', JSON.stringify(currentPlan));

        // Also update in savedPlans collection
        setSavedPlans(prev => {
          const index = prev.findIndex(p => p.id === currentPlan.id);
          if (index !== -1) {
            const next = [...prev];
            next[index] = currentPlan;
            return next;
          } else {
            return [currentPlan, ...prev];
          }
        });
      } else {
        localStorage.removeItem('eventcraft_active_plan');
      }
    } catch (e) {
      console.warn('Failed to persist active plan:', e);
    }
  }, [currentPlan]);

  // Sync savedPlans to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eventcraft_saved_plans', JSON.stringify(savedPlans));
    } catch (e) {
      console.warn('Failed to persist saved plans list:', e);
    }
  }, [savedPlans]);

  // Initial health check to see if backend is in Demo Mode
  useEffect(() => {
    api.checkHealth().then(res => {
      if (res.isDemoMode) {
        setIsDemoMode(true);
      }
    });
  }, []);

  const createPlan = useCallback(
    async (input: EventSetupInput) => {
      setIsGenerating(true);
      try {
        const { plan, isDemo, isCached } = await api.generatePlan(input);
        setCurrentPlan(plan);
        setActiveTab('overview');

        if (isCached) {
          showToast('Loaded instant cached celebration plan!', 'info');
        } else if (isDemo) {
          showToast('Curated demo plan generated successfully!', 'info');
        } else {
          showToast('GenAI successfully engineered your celebration plan!', 'success');
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Plan generation failed';
        showToast(message, 'danger');
        throw error;
      } finally {
        setIsGenerating(false);
      }
    },
    [showToast],
  );

  const updatePlan = useCallback((updated: EventPlan) => {
    setCurrentPlan({
      ...updated,
      updatedAt: new Date().toISOString(),
    });
  }, []);

  const updateBudgetItem = useCallback((id: string, actualSpent: number) => {
    setCurrentPlan(prev => {
      if (!prev) return null;
      const nextBreakdown = prev.budgetBreakdown.map(b =>
        b.id === id ? { ...b, actualSpent: Math.max(0, actualSpent) } : b,
      );
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        budgetBreakdown: nextBreakdown,
      };
    });
  }, []);

  const toggleTask = useCallback((id: string) => {
    setCurrentPlan(prev => {
      if (!prev) return null;
      const nextTimeline = prev.timeline.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      );
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        timeline: nextTimeline,
      };
    });
  }, []);

  const toggleVendor = useCallback((id: string) => {
    setCurrentPlan(prev => {
      if (!prev) return null;
      const nextVendors = prev.vendorChecklist.map(v =>
        v.id === id ? { ...v, booked: !v.booked } : v,
      );
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        vendorChecklist: nextVendors,
      };
    });
  }, []);

  const loadSavedPlan = useCallback(
    (id: string) => {
      const found = savedPlans.find(p => p.id === id);
      if (found) {
        setCurrentPlan(found);
        setActiveTab('overview');
        showToast(`Loaded "${found.eventInput.eventName}"`, 'info');
      }
    },
    [savedPlans, showToast],
  );

  const deleteSavedPlan = useCallback(
    (id: string) => {
      setSavedPlans(prev => prev.filter(p => p.id !== id));
      if (currentPlan?.id === id) {
        setCurrentPlan(null);
      }
      showToast('Plan deleted from saved storage', 'info');
    },
    [currentPlan, showToast],
  );

  const loadDemoPlan = useCallback(
    async (type: 'wedding' | 'birthday') => {
      setIsGenerating(true);
      try {
        const demoPlans = await api.getDemoPlans();
        const plan = demoPlans[type];
        if (plan) {
          // Clone with new ID so user edits are distinct
          const clone: EventPlan = {
            ...plan,
            id: `plan-demo-${type}-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setCurrentPlan(clone);
          setActiveTab('overview');
          showToast(`Loaded showcase ${type} plan!`, 'success');
        }
      } catch (err) {
        showToast('Failed to load demo template', 'danger');
      } finally {
        setIsGenerating(false);
      }
    },
    [showToast],
  );

  const importPlan = useCallback(
    (plan: EventPlan) => {
      setCurrentPlan(plan);
      setActiveTab('overview');
      showToast(`Imported "${plan.eventInput.eventName}" successfully!`, 'success');
    },
    [showToast],
  );

  const resetCurrentPlan = useCallback(() => {
    setCurrentPlan(null);
  }, []);

  return (
    <PlanContext.Provider
      value={{
        currentPlan,
        savedPlans,
        isGenerating,
        activeTab,
        setActiveTab,
        isDemoMode,
        setIsDemoMode,
        createPlan,
        updatePlan,
        updateBudgetItem,
        toggleTask,
        toggleVendor,
        loadSavedPlan,
        deleteSavedPlan,
        loadDemoPlan,
        importPlan,
        resetCurrentPlan,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = (): PlanContextType => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};
