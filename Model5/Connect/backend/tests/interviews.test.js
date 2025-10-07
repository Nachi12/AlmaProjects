const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('Interviews Routes', () => {
  let token;
  let userId;
  let testUser;

  beforeAll(async () => {
    // Create test user with hashed password
    const hashedPassword = await bcrypt.hash('Password123', 10);
    testUser = await User.create({
      name: 'Test User Interviews',
      email: 'testuser4@example.com',
      password: hashedPassword,
      contact: '1234567890',
      isActive: true
    });
    
    userId = testUser._id;
    
    // Generate valid token
    token = jwt.sign(
      { userId: userId.toString() },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
  });

  it('should get interviews list', async () => {
    const res = await request(app)
      .get('/api/interviews')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('interviews');
    expect(Array.isArray(res.body.interviews)).toBe(true);
  });

  it('should create a new interview', async () => {
    const interviewData = {
      type: 'frontend',
      date: '2025-10-10',
      time: '10:00',
      interviewer: 'John Doe',
      duration: 60,
      notes: 'Test interview'
    };

    const res = await request(app)
      .post('/api/interviews')
      .set('Authorization', `Bearer ${token}`)
      .send(interviewData);
      
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('success', true);
  });
});
