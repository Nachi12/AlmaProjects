// tests/__mocks__/Resource.js
const Resource = jest.fn().mockImplementation((data) => ({
  ...data,
  save: jest.fn().mockResolvedValue(data),
}));

// static methods
Resource.find = jest.fn();
Resource.findOne = jest.fn();
Resource.findById = jest.fn();
Resource.create = jest.fn();
Resource.findByIdAndUpdate = jest.fn();
Resource.findByIdAndDelete = jest.fn();

module.exports = Resource;
