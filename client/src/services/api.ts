import {
  EventPlan,
  EventSetupInput,
  ChatAssistantRequest,
  ChatAssistantResponse,
} from '@eventcraft/shared';

const API_BASE = '/api';

export interface GeneratePlanResult {
  plan: EventPlan;
  isDemo: boolean;
  isCached: boolean;
}

export const api = {
  /**
   * Generates a new event plan via backend Gemini AI or fallback demo
   */
  async generatePlan(input: EventSetupInput): Promise<GeneratePlanResult> {
    const response = await fetch(`${API_BASE}/plan/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const errorMessage =
        data.details && Array.isArray(data.details)
          ? data.details
              .map((d: { field: string; message: string }) => `${d.field}: ${d.message}`)
              .join(', ')
          : data.error || 'Failed to generate plan';
      throw new Error(errorMessage);
    }

    return {
      plan: data.data,
      isDemo: Boolean(data.isDemo),
      isCached: Boolean(data.isCached),
    };
  },

  /**
   * Sends user follow-up message to the AI Assistant
   */
  async sendChatMessage(request: ChatAssistantRequest): Promise<ChatAssistantResponse> {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to communicate with AI Assistant');
    }

    return data.data;
  },

  /**
   * Fetches curated demo templates
   */
  async getDemoPlans(): Promise<Record<string, EventPlan>> {
    const response = await fetch(`${API_BASE}/plan/demo-plans`);
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error('Failed to load demo plans');
    }
    return data.data;
  },

  /**
   * Checks backend system health
   */
  async checkHealth(): Promise<{ status: string; isDemoMode: boolean }> {
    try {
      const response = await fetch(`${API_BASE}/health`);
      if (!response.ok) return { status: 'down', isDemoMode: true };
      const data = await response.json();
      return { status: data.status, isDemoMode: Boolean(data.isDemoMode) };
    } catch {
      return { status: 'down', isDemoMode: true };
    }
  },
};
