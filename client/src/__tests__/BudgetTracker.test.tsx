import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BudgetTracker } from '../components/BudgetTracker/BudgetTracker';
import { PlanProvider } from '../context/PlanContext';
import { ToastProvider } from '../context/ToastContext';
import { SAMPLE_WEDDING_PLAN } from '@eventcraft/shared';

// Pre-set localStorage with active plan
beforeEach(() => {
  localStorage.setItem('eventcraft_active_plan', JSON.stringify(SAMPLE_WEDDING_PLAN));
});

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('BudgetTracker Component', () => {
  it('renders total budget and category breakdown', () => {
    render(
      <ToastProvider>
        <PlanProvider>
          <BudgetTracker />
        </PlanProvider>
      </ToastProvider>,
    );

    const totalBudgetLabels = screen.getAllByText(/Total Budget/i);
    expect(totalBudgetLabels.length).toBeGreaterThan(0);
    expect(screen.getByText(/Remaining Balance/i)).toBeInTheDocument();
    expect(screen.getByText(/Category Allocations & Live Expense Tracking/i)).toBeInTheDocument();
  });

  it('triggers over-budget alert when actual spent exceeds total budget', () => {
    render(
      <ToastProvider>
        <PlanProvider>
          <BudgetTracker />
        </PlanProvider>
      </ToastProvider>,
    );

    // Find the first actual spent input and type a large number exceeding total budget (e.g. 5,000,000)
    const inputs = screen.getAllByRole('spinbutton');
    const firstInput = inputs[0];

    fireEvent.change(firstInput, { target: { value: '5000000' } });

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Budget Exceeded by/i)).toBeInTheDocument();
  });
});
