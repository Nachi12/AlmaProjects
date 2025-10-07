const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('User Routes', () => {
  let token;
  let userId;
  let testUser;

  beforeAll(async () => {
    // Clear users
    await User.deleteMany({});
    
    // Create a test user with hashed password
    const hashedPassword = await bcrypt.hash('Password123', 10);
    testUser = await User.create({
      name: 'Test User',
      email: 'testuser3@example.com',
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

  it('should get user profile', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('email');
  });

  it('should update user profile', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name', contact: '9876543210' });
      
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated Name');
  });
});
