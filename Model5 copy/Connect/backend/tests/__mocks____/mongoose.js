// tests/__mocks__/mongoose.js
const Schema = function () {
  return {};
};

// attach Types to Schema directly
Schema.Types = {
  ObjectId: jest.fn(() => "mockObjectId"),
};

const mongoose = {
  Schema,
  model: jest.fn(() => ({})),
  Types: {
    ObjectId: jest.fn(() => "mockObjectId"),
  },
};

module.exports = mongoose;
