// tests/__mocks__/User.js
const User = jest.fn().mockImplementation((data) => ({
  ...data,
  save: jest.fn().mockResolvedValue(data),
}));

// attach static methods
User.findOne = jest.fn();
User.findById = jest.fn();
User.create = jest.fn();
User.findByIdAndUpdate = jest.fn();
User.findByIdAndDelete = jest.fn();

module.exports = User;
