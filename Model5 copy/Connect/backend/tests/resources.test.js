const request = require('supertest');
const app = require('../server');

describe('Resources Routes', () => {
  it('should get resources', async () => {
    const res = await request(app).get('/api/resources');
      
    expect(res.status).toBe(200);
    // Your API returns: { resources: [], total: 0, currentPage: 1, totalPages: 0 }
    expect(res.body).toHaveProperty('resources');
    expect(Array.isArray(res.body.resources)).toBe(true);
  });

  it('should filter resources by category', async () => {
    const res = await request(app).get('/api/resources?category=frontend');
      
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('resources');
    expect(Array.isArray(res.body.resources)).toBe(true);
  });
});
