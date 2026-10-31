import request from 'supertest';
import { createApp } from '../app';
import { config } from '../config/env';

describe('CORS and Static Assets Configuration', () => {
  const app = createApp();

  describe('Static Assets & Frontend Files', () => {
    it('GET /assets/test-file.css should not be blocked by CORS and should allow all origins', async () => {
      const res = await request(app)
        .get('/assets/test-file.css')
        .set('Origin', 'https://eventcraft-ai1.onrender.com');

      expect(res.header['access-control-allow-origin']).toBe('*');
      // Should not throw or return 500 CORS policy error
      expect(res.status).not.toBe(500);
      expect(res.body.error).not.toBe('Blocked by CORS policy');
    });

    it('OPTIONS /assets/index-COf0NaWa.js preflight should return 204 with open CORS headers', async () => {
      const res = await request(app)
        .options('/assets/index-COf0NaWa.js')
        .set('Origin', 'https://eventcraft-ai1.onrender.com')
        .set('Access-Control-Request-Method', 'GET');

      expect(res.status).toBe(204);
      expect(res.header['access-control-allow-origin']).toBe('*');
    });
  });

  describe('API Endpoints CORS Protection', () => {
    it('GET /api/health should allow requests with no Origin header (curl / server-to-server)', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
    });

    it('GET /api/health should allow requests from the Render production origin', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'https://eventcraft-ai1.onrender.com');

      expect(res.status).toBe(200);
      expect(res.header['access-control-allow-origin']).toBe('https://eventcraft-ai1.onrender.com');
      expect(res.header['access-control-allow-credentials']).toBe('true');
    });

    it('GET /api/health should allow requests from any *.onrender.com subdomain', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'https://preview-deploy.onrender.com');

      expect(res.status).toBe(200);
      expect(res.header['access-control-allow-origin']).toBe('https://preview-deploy.onrender.com');
    });

    it('GET /api/health should allow same-origin requests matching Host header', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Host', 'mycustomdomain.com')
        .set('Origin', 'https://mycustomdomain.com');

      expect(res.status).toBe(200);
      expect(res.header['access-control-allow-origin']).toBe('https://mycustomdomain.com');
    });

    it('OPTIONS /api/plan/generate should handle CORS preflight for Render origin', async () => {
      const res = await request(app)
        .options('/api/plan/generate')
        .set('Origin', 'https://eventcraft-ai1.onrender.com')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type');

      expect(res.status).toBe(204);
      expect(res.header['access-control-allow-origin']).toBe('https://eventcraft-ai1.onrender.com');
      expect(res.header['access-control-allow-methods']).toContain('POST');
    });

    it('GET /api/health should reject unauthorized origins when in production mode', async () => {
      const originalIsProduction = config.isProduction;
      try {
        config.isProduction = true;
        const res = await request(app)
          .get('/api/health')
          .set('Origin', 'https://malicious-unauthorized-site.com')
          .set('Host', 'eventcraft-ai1.onrender.com');

        expect(res.status).toBe(403);
        expect(res.body.error).toBe('Blocked by CORS policy');
      } finally {
        config.isProduction = originalIsProduction;
      }
    });
  });
});
