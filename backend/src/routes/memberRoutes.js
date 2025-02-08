const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Get all members
router.get('/', memberController.getAllMembers);

// Get members expiring soon
router.get('/expiring-soon', memberController.getExpiringSoon);

// Get member by ID
router.get('/:id', memberController.getMemberById);

// Create new member
router.post('/', memberController.createMember);

// Update member
router.put('/:id', memberController.updateMember);

// Delete member
router.delete('/:id', memberController.deleteMember);

// Verify RFID
router.post('/verify-rfid', memberController.verifyRFID);

module.exports = router; 