const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const Interview = require('../models/Interview');
const mongoose = require('mongoose');
const { Schema } = mongoose;



// GET /api/interviews - Get all interviews for authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    console.log('📥 GET /api/interviews - User ID:', req.userId);
    console.log('📥 Query params:', req.query);
    
    const { status } = req.query;
    let filter = { owner: req.userId };
    
    // Add status filtering
    if (status === 'upcoming') {
      filter.status = { $in: ['scheduled', 'upcoming'] };
    } else if (status === 'completed') {
      filter.status = 'completed';
    }
    
    const interviews = await Interview.find(filter)
      .sort({ date: 1, time: 1 });

    console.log('✅ Found interviews:', interviews.length);
    
    res.status(200).json({ 
      success: true,
      interviews: interviews 
    });
  } catch (error) {
    console.error('❌ Error fetching interviews:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch interviews', 
      error: error.message 
    });
  }
});


// POST /api/interviews - Create new interview
router.post('/', 
  authenticate,
  [
    body('type').notEmpty().withMessage('Interview type is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required (HH:MM)'),
    body('interviewer').notEmpty().withMessage('Interviewer name is required'),
    body('duration').optional().isInt({ min: 15, max: 240 }).withMessage('Duration must be between 15-240 minutes')
  ],
  async (req, res) => {
    console.log('\n🚀 ===== POST /api/interviews CALLED =====');
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
    console.log('👤 User ID:', req.userId);
    console.log('🔑 Auth header:', req.headers.authorization ? 'Present' : 'Missing');

    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { type, date, time, interviewer, duration, notes } = req.body;

      // Create new interview
      const interviewData = {
        type: type,
        date: new Date(date),
        time: time,
        interviewer: interviewer,
        duration: parseInt(duration) || 60,
        notes: notes || '',
        owner: req.userId,
        status: 'scheduled'
      };

      console.log('📝 Creating interview with data:', interviewData);
      
      const interview = new Interview(interviewData);
      const savedInterview = await interview.save();
      
      console.log('✅ Interview saved successfully!');
      console.log('📄 Saved document ID:', savedInterview._id);
      console.log('===================================\n');

      res.status(201).json({
        success: true,
        message: 'Interview scheduled successfully',
        interview: savedInterview
      });

    } catch (error) {
      console.error('❌ Error creating interview:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Failed to schedule interview',
        error: error.message
      });
    }
  }
);

// GET /api/interviews/:id - Get single interview
router.get('/:id', authenticate, async (req, res) => {
  try {
    console.log('📥 GET /api/interviews/:id - ID:', req.params.id);
    
    const interview = await Interview.findOne({
      _id: req.params.id,
      owner: req.userId
    });

    if (!interview) {
      console.log('❌ Interview not found');
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    console.log('✅ Found interview');
    res.status(200).json({
      success: true,
      interview: interview
    });
  } catch (error) {
    console.error('❌ Error fetching interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview',
      error: error.message
    });
  }
});



// PATCH /api/interviews/:id/complete - Mark interview as completed
router.patch('/:id/complete', authenticate, async (req, res) => {
  try {
    console.log('✅ PATCH /api/interviews/:id/complete - ID:', req.params.id);
    
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      { 
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!interview) {
      console.log('❌ Interview not found or unauthorized');
      return res.status(404).json({
        success: false,
        message: 'Interview not found or unauthorized'
      });
    }
    
    console.log('✅ Interview marked as completed');
    res.status(200).json({ 
      success: true,
      message: 'Interview completed successfully', 
      interview: interview
    });
  } catch (error) {
    console.error('❌ Error completing interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete interview',
      error: error.message
    });
  }
});





// PUT /api/interviews/:id - Update interview
router.put('/:id', authenticate, async (req, res) => {
  try {
    console.log('📝 PUT /api/interviews/:id - ID:', req.params.id);
    console.log('📦 Update data:', req.body);
    
    const { id } = req.params;
    const updates = req.body;

    const interview = await Interview.findOneAndUpdate(
      { _id: id, owner: req.userId },
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!interview) {
      console.log('❌ Interview not found or unauthorized');
      return res.status(404).json({
        success: false,
        message: 'Interview not found or unauthorized'
      });
    }

    console.log('✅ Interview updated successfully');
    res.status(200).json({
      success: true,
      message: 'Interview updated successfully',
      interview: interview
    });
  } catch (error) {
    console.error('❌ Error updating interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update interview',
      error: error.message
    });
  }
});

// DELETE /api/interviews/:id - Delete interview
router.delete('/:id', authenticate, async (req, res) => {
  try {
    console.log('🗑️  DELETE /api/interviews/:id - ID:', req.params.id);
    
    const { id } = req.params;

    const interview = await Interview.findOneAndDelete({
      _id: id,
      owner: req.userId
    });

    if (!interview) {
      console.log('❌ Interview not found or unauthorized');
      return res.status(404).json({
        success: false,
        message: 'Interview not found or unauthorized'
      });
    }

    console.log('✅ Interview deleted successfully');
    res.status(200).json({
      success: true,
      message: 'Interview deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete interview',
      error: error.message
    });
  }
});

module.exports = router;
