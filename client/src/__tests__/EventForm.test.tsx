import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventForm } from '../components/EventForm/EventForm';
import { PlanProvider } from '../context/PlanContext';
import { ToastProvider } from '../context/ToastContext';

// Mock API
vi.mock('../services/api', () => ({
  api: {
    generatePlan: vi.fn().mockResolvedValue({
      plan: {
        id: 'plan-123',
        eventInput: { eventName: 'Test Event' },
        budgetBreakdown: [],
        timeline: [],
        vendorChecklist: [],
        personalizedIdeas: { themes: [], decor: [], menu: [], activities: [], returnGifts: [] },
      },
      isDemo: true,
      isCached: false,
    }),
    checkHealth: vi.fn().mockResolvedValue({ status: 'healthy', isDemoMode: true }),
  },
}));

describe('EventForm Component', () => {
  it('renders form fields and submit button', () => {
    render(
      <ToastProvider>
        <PlanProvider>
          <EventForm />
        </PlanProvider>
      </ToastProvider>,
    );

    expect(screen.getByLabelText(/Event Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Event Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Estimated Guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Total Budget/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Generate Full Celebration Plan/i }),
    ).toBeInTheDocument();
  });

  it('pre-fills sample data when clicking sample buttons', () => {
    render(
      <ToastProvider>
        <PlanProvider>
          <EventForm />
        </PlanProvider>
      </ToastProvider>,
    );

    const weddingPill = screen.getByRole('button', { name: /Royal Wedding/i });
    fireEvent.click(weddingPill);

    const nameInput = screen.getByLabelText(/Event Name/i) as HTMLInputElement;
    expect(nameInput.value).toContain('Kabir & Tara');
  });

  it('displays validation error if event name is left empty', async () => {
    render(
      <ToastProvider>
        <PlanProvider>
          <EventForm />
        </PlanProvider>
      </ToastProvider>,
    );

    const submitBtn = screen.getByRole('button', { name: /Generate Full Celebration Plan/i });
    fireEvent.click(submitBtn);

    const errorMsg = await screen.findByText(/Event name must be at least 2 characters/i);
    expect(errorMsg).toBeInTheDocument();
  });
});
