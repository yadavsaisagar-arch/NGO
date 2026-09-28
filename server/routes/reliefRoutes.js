const express = require('express');
const router = express.Router();
const {
  addReliefMaterial,
  getReliefSummary,
  getMyReliefMaterials,
  getReliefMaterialById,
  updateReliefMaterial,
  deleteReliefMaterial,
} = require('../controllers/reliefController');
const { protect } = require('../middleware/authMiddleware');

// Public route to view aggregate statistics
router.get('/summary', getReliefSummary);

// Protected user routes
router.post('/', protect, addReliefMaterial);
router.get('/my', protect, getMyReliefMaterials);
router.get('/:id', protect, getReliefMaterialById);
router.patch('/:id', protect, updateReliefMaterial);
router.delete('/:id', protect, deleteReliefMaterial);

module.exports = router;
