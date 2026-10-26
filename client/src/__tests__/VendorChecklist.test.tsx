import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VendorChecklist } from '../components/VendorChecklist/VendorChecklist';
import { PlanProvider } from '../context/PlanContext';
import { ToastProvider } from '../context/ToastContext';
import { SAMPLE_WEDDING_PLAN } from '@eventcraft/shared';

beforeEach(() => {
  localStorage.setItem('eventcraft_active_plan', JSON.stringify(SAMPLE_WEDDING_PLAN));
});

afterEach(() => {
  localStorage.clear();
});

describe('VendorChecklist Component', () => {
  it('renders vendor items with cost range and inquiry questions', () => {
    render(
      <ToastProvider>
        <PlanProvider>
          <VendorChecklist />
        </PlanProvider>
      </ToastProvider>,
    );

    expect(screen.getByText(/Vendor Verification & Booking Checklist/i)).toBeInTheDocument();
    expect(screen.getByText(/Royal Heritage Haveli & Resort/i)).toBeInTheDocument();
    const questionsHeaders = screen.getAllByText(/What to Ask & Verify:/i);
    expect(questionsHeaders.length).toBeGreaterThan(0);
  });
});
