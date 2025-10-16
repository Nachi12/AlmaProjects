const mongoose = require('mongoose');
const { Schema } = mongoose;

const interviewSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner user is required']
  },
  type: {
    type: String,
    enum: ['frontend', 'backend', 'fullstack', 'behavioral', 'dsa', 'system', 'hr', 'technical'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  interviewer: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 60
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['scheduled', 'upcoming', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  result: {
    type: String,
    enum: ['passed', 'failed', 'pending'],
    default: 'pending'
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  feedback: {
    type: String,
    default: ''
  },
  completedAt: {
    type: Date,
    default: null
  },
    status: {
    type: String,
    enum: ['scheduled', 'upcoming', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
