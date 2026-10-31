import {
  EventPlan,
  EventSetupInput,
  ChatAssistantRequest,
  ChatAssistantResponse,
} from '@eventcraft/shared';
import {
  generateClientPlan,
  generateClientChatResponse,
  getClientDemoPlans,
} from './clientPlanEngine';

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
    try {
      const response = await fetch(`${API_BASE}/plan/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Plan generation failed');
      }

      return {
        plan: data.data,
        isDemo: Boolean(data.isDemo),
        isCached: Boolean(data.isCached),
      };
    } catch (error) {
      console.warn('Backend unavailable, using client-side execution engine:', error);
      const plan = generateClientPlan(input);
      return {
        plan,
        isDemo: true,
        isCached: false,
      };
    }
  },

  /**
   * Sends user follow-up message to the AI Assistant
   */
  async sendChatMessage(request: ChatAssistantRequest): Promise<ChatAssistantResponse> {
    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Chat assistant error');
      }

      return data.data;
    } catch (error) {
      console.warn('Backend unavailable, using client-side chat assistant:', error);
      return generateClientChatResponse(request.message, request.currentPlan);
    }
  },

  /**
   * Fetches curated demo templates
   */
  async getDemoPlans(): Promise<Record<string, EventPlan>> {
    try {
      const response = await fetch(`${API_BASE}/plan/demo-plans`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          return data.data;
        }
      }
    } catch {
      // Fallback below
    }
    return getClientDemoPlans();
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
