const mongoose = require('mongoose');
const { Schema } = mongoose;

const resourceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'fullstack', 'behavioral', 'dsa', 'system', 'hr', 'technical'],
    default: 'technical'
  },
  description: {
    type: String
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
