const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');

// Get all records
router.get('/', recordController.getAllRecords);

// Get records by date range
router.get('/date-range', recordController.getRecordsByDateRange);

// Get today's count
router.get('/today-count', recordController.getTodayCount);

// Get recent activity
router.get('/recent-activity', recordController.getRecentActivity);

// Get records by member
router.get('/member/:memberId', recordController.getRecordsByMember);

// Get record by ID
router.get('/:id', recordController.getRecordById);

// Create new record (record attendance)
router.post('/', recordController.createRecord);

// Delete record
router.delete('/:id', recordController.deleteRecord);

module.exports = router; 