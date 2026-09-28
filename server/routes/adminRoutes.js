const express = require('express');
const router = express.Router();
const {
  getAllEmergencyRequests,
  updateEmergencyRequestStatus,
} = require('../controllers/emergencyController');
const {
  getAllVolunteers,
  updateVolunteerStatus,
} = require('../controllers/volunteerController');
const { getAllReliefAdmin } = require('../controllers/reliefController');
const {
  getAllContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} = require('../controllers/contactController');
const {
  getDashboardStats,
  getUsersList,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All admin routes require authentication and ADMIN role
router.use(protect);
router.use(authorize('ADMIN'));

// System Dashboard Statistics
router.get('/dashboard', getDashboardStats);
router.get('/users', getUsersList);

// Emergency request management
router.get('/emergency', getAllEmergencyRequests);
router.patch('/emergency/:id/status', updateEmergencyRequestStatus);

// Volunteer management
router.get('/volunteers', getAllVolunteers);
router.patch('/volunteers/:id/status', updateVolunteerStatus);

// Relief material management
router.get('/relief', getAllReliefAdmin);

// Contact message management
router.get('/contact', getAllContactMessages);
router.patch('/contact/:id/status', updateContactMessageStatus);
router.delete('/contact/:id', deleteContactMessage);

module.exports = router;
