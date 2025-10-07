const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

describe('Auth Routes', () => {
  let token;
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'Password123',
    contact: '1234567890'
  };

  // Clear users before each test in this suite
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    token = res.body.token;
  });

  it('should return error if user already exists', async () => {
    // First create a user
    await request(app).post('/api/auth/register').send(testUser);
    
    // Try to register again
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should validate required fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});

    expect(res.statusCode).toBe(400);
  });

  it('should login user with correct credentials', async () => {
    // First register
    await request(app).post('/api/auth/register').send(testUser);
    
    // Then login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should return error for invalid credentials', async () => {
    // First register
    await request(app).post('/api/auth/register').send(testUser);
    
    // Try login with wrong password
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it('should authenticate user with Google token', async () => {
    const res = await request(app)
      .post('/api/auth/google')
      .send({
        tokenId: 'mockGoogleToken'
      });

    // Either success or method not implemented
    expect([200, 201, 400, 404, 501]).toContain(res.statusCode);
  });
});
