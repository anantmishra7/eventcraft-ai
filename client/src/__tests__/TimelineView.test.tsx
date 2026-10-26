import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimelineView } from '../components/TimelineView/TimelineView';
import { PlanProvider } from '../context/PlanContext';
import { ToastProvider } from '../context/ToastContext';
import { SAMPLE_WEDDING_PLAN } from '@eventcraft/shared';

beforeEach(() => {
  localStorage.setItem('eventcraft_active_plan', JSON.stringify(SAMPLE_WEDDING_PLAN));
});

afterEach(() => {
  localStorage.clear();
});

describe('TimelineView Component', () => {
  it('renders timeline tasks and progress metrics', () => {
    render(
      <ToastProvider>
        <PlanProvider>
          <TimelineView />
        </PlanProvider>
      </ToastProvider>,
    );

    expect(screen.getByText(/Milestone Countdown Timeline/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText(/Finalize and Lock Venue Dates/i)).toBeInTheDocument();
  });

  it('filters tasks by completion status', () => {
    render(
      <ToastProvider>
        <PlanProvider>
          <TimelineView />
        </PlanProvider>
      </ToastProvider>,
    );

    const pendingBtn = screen.getByRole('button', { name: /Pending/i });
    fireEvent.click(pendingBtn);

    // Verify filter activated
    expect(pendingBtn).toHaveClass(/filterActive/);
  });
});
