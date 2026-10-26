import request from 'supertest';
import { createApp } from '../app';

describe('Health API Routes', () => {
  const app = createApp();

  it('GET /api/health should return 200 with service status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('EventCraft AI Backend');
    expect(typeof res.body.uptimeSeconds).toBe('number');
  });

  it('GET /api/non-existent-route should return 404', async () => {
    const res = await request(app).get('/api/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
