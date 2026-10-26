import request from 'supertest';
import { createApp } from '../app';
import { SAMPLE_WEDDING_PLAN } from '@eventcraft/shared';

describe('Chat Assistant API Routes', () => {
  const app = createApp();

  it('POST /api/chat should provide contextual response for budget reduction', async () => {
    const payload = {
      message: 'Can you make this plan cheaper by reducing the budget?',
      currentPlan: SAMPLE_WEDDING_PLAN,
      chatHistory: [],
    };

    const res = await request(app).post('/api/chat').send(payload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reply).toBeDefined();
    expect(res.body.data.reply.length).toBeGreaterThan(10);
    expect(res.body.data.updatedPlan).toBeDefined();
    // Reduced budget should be lower than original
    expect(res.body.data.updatedPlan.eventInput.totalBudget).toBeLessThan(
      SAMPLE_WEDDING_PLAN.eventInput.totalBudget,
    );
  });

  it('POST /api/chat should reject empty messages with 400', async () => {
    const res = await request(app).post('/api/chat').send({
      message: '   ',
      currentPlan: SAMPLE_WEDDING_PLAN,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
