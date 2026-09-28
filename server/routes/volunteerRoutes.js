const express = require('express');
const router = express.Router();
const {
  registerVolunteer,
  getMyVolunteerProfile,
} = require('../controllers/volunteerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, registerVolunteer);
router.get('/my', protect, getMyVolunteerProfile);

module.exports = router;
