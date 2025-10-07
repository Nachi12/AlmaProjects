// tests/__mocks__/Interview.js
const Interview = jest.fn().mockImplementation((data) => ({
  ...data,
  save: jest.fn().mockResolvedValue(data),
}));

// static methods
Interview.find = jest.fn();
Interview.findOne = jest.fn();
Interview.findById = jest.fn();
Interview.create = jest.fn();
Interview.findByIdAndUpdate = jest.fn();
Interview.findByIdAndDelete = jest.fn();

module.exports = Interview;
