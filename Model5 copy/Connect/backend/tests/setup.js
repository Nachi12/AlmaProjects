const mongoose = require('mongoose');

// Setup function runs before all tests
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // connect to test database
  const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27017/connect-test';
  
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Test database connected');
  } catch (error) {
    console.error('❌ MongoDB test connection error:', error);
    throw error;
  }
});

// Cleanup after each test - but DON'T delete users
afterEach(async () => {
  // Only clear interviews and resources, keep users
  const Interview = mongoose.model('Interview');
  const Resource = mongoose.model('Resource');
  
  try {
    if (Interview) await Interview.deleteMany({});
    if (Resource) await Resource.deleteMany({});
  } catch (error) {
    // Models might not exist yet
  }
});

// Teardown after all tests complete
afterAll(async () => {
  try {
    // Clear ALL collections after all tests
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    
    await mongoose.connection.close();
    console.log('✅ Test database disconnected');
  } catch (error) {
    console.error('❌ Error closing database:', error);
  }
});

// Set test timeout
jest.setTimeout(30000);
