const request = require('supertest');
const app = require('../src/app');

describe('Auth validation', () => {
  it('rejects invalid registration payload', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('requires credentials for login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'invalid',
      password: ''
    });
    expect(res.status).toBe(422);
  });
});

describe('Auth guard', () => {
  it('blocks protected route without token', async () => {
    const res = await request(app).get('/api/tickets');
    expect(res.status).toBe(401);
  });
});

