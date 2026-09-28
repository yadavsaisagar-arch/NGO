const express = require('express');
const router = express.Router();
const {
  createEmergencyRequest,
  getMyEmergencyRequests,
  getEmergencyRequestById,
} = require('../controllers/emergencyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createEmergencyRequest);
router.get('/my', protect, getMyEmergencyRequests);
router.get('/:id', protect, getEmergencyRequestById);

module.exports = router;
