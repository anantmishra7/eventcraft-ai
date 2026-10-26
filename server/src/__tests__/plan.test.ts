import request from 'supertest';
import { createApp } from '../app';

describe('Plan API Routes', () => {
  const app = createApp();

  const validPayload = {
    eventType: 'birthday',
    eventName: 'Rohan 25th Silver Jubilee',
    date: '2026-11-20',
    guestCount: 50,
    totalBudget: 150000,
    city: 'Pune',
    themePreferences: 'Vintage retro neon',
    dietaryNeeds: 'Vegetarian and Continental',
    additionalNotes: 'Need a karaoke setup',
  };

  it('GET /api/plan/demo-plans should return sample plans', async () => {
    const res = await request(app).get('/api/plan/demo-plans');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.wedding).toBeDefined();
    expect(res.body.data.birthday).toBeDefined();
  });

  it('POST /api/plan/generate should validate and return a structured plan', async () => {
    const res = await request(app).post('/api/plan/generate').send(validPayload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.eventInput.eventName).toBe(validPayload.eventName);
    expect(res.body.data.budgetBreakdown.length).toBeGreaterThan(0);
    expect(res.body.data.timeline.length).toBeGreaterThan(0);
    expect(res.body.data.vendorChecklist.length).toBeGreaterThan(0);
    expect(res.body.data.personalizedIdeas).toBeDefined();

    // Sum of budget items should closely equal totalBudget
    const sum = res.body.data.budgetBreakdown.reduce(
      (acc: number, item: { allocatedAmount: number }) => acc + item.allocatedAmount,
      0,
    );
    expect(Math.abs(sum - validPayload.totalBudget)).toBeLessThanOrEqual(50);
  });

  it('POST /api/plan/generate should return cached response on identical second request', async () => {
    const res = await request(app).post('/api/plan/generate').send(validPayload);
    expect(res.status).toBe(200);
    expect(res.header['x-cache']).toBe('HIT');
    expect(res.body.isCached).toBe(true);
  });

  it('POST /api/plan/generate should fail with 400 on invalid input', async () => {
    const invalidPayload = {
      ...validPayload,
      guestCount: -5, // Invalid negative count
      totalBudget: 500, // Below minimum 10,000 INR
    };

    const res = await request(app).post('/api/plan/generate').send(invalidPayload);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.details).toBeDefined();
    expect(res.body.details.length).toBeGreaterThanOrEqual(1);
  });
});
