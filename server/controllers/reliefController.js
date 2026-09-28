const ReliefMaterial = require('../models/ReliefMaterial');

// @desc    Add new relief material
// @route   POST /api/relief
// @access  Private (User/Admin)
const addReliefMaterial = async (req, res, next) => {
  try {
    const { materialName, quantity, category, location } = req.body;

    // Field validations matching original logic
    if (!materialName || materialName.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Material name must be at least 3 characters.',
      });
    }

    if (!/^[A-Za-z ]+$/.test(materialName.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Material name should contain only letters.',
      });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1.',
      });
    }

    const allowedCategories = [
      'Food',
      'Water',
      'Medicine',
      'Clothing',
      'Shelter Material',
      'Other',
    ];
    if (!category || !allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid category.',
      });
    }

    if (!location || location.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Location must be at least 5 characters.',
      });
    }

    const newMaterial = await ReliefMaterial.create({
      userId: req.user._id,
      materialName: materialName.trim(),
      quantity: qty,
      category,
      distributionLocation: location.trim(),
      status: 'Available',
    });

    res.status(201).json({
      success: true,
      message: 'Relief Material Added Successfully!',
      materialId: newMaterial.materialId,
      material: newMaterial,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get real-time database aggregated relief summary
// @route   GET /api/relief/summary
// @access  Public (or Private)
const getReliefSummary = async (req, res, next) => {
  try {
    const summaryAgg = await ReliefMaterial.aggregate([
      {
        $group: {
          _id: '$category',
          totalQuantity: { $sum: '$quantity' },
          totalEntries: { $sum: 1 },
        },
      },
    ]);

    // Format category totals
    const categoryTotals = {
      Food: 0,
      Water: 0,
      Medicine: 0,
      Clothing: 0,
      'Shelter Material': 0,
      Other: 0,
      totalQuantity: 0,
      totalEntries: 0,
    };

    summaryAgg.forEach((item) => {
      if (item._id && categoryTotals.hasOwnProperty(item._id)) {
        categoryTotals[item._id] = item.totalQuantity;
      }
      categoryTotals.totalQuantity += item.totalQuantity;
      categoryTotals.totalEntries += item.totalEntries;
    });

    res.status(200).json({
      success: true,
      summary: categoryTotals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's submitted relief materials
// @route   GET /api/relief/my
// @access  Private
const getMyReliefMaterials = async (req, res, next) => {
  try {
    const materials = await ReliefMaterial.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: materials.length,
      materials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single relief material by ID
// @route   GET /api/relief/:id
// @access  Private
const getReliefMaterialById = async (req, res, next) => {
  try {
    const material = await ReliefMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Relief material not found.',
      });
    }

    // Ownership check: owner or admin
    if (
      req.user.role !== 'ADMIN' &&
      material.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to access this item.',
      });
    }

    res.status(200).json({
      success: true,
      material,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update relief material
// @route   PATCH /api/relief/:id
// @access  Private (Owner/Admin)
const updateReliefMaterial = async (req, res, next) => {
  try {
    const material = await ReliefMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Relief material not found.',
      });
    }

    if (
      req.user.role !== 'ADMIN' &&
      material.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot modify this relief material.',
      });
    }

    const { materialName, quantity, category, location, status } = req.body;
    if (materialName) material.materialName = materialName.trim();
    if (quantity) material.quantity = parseInt(quantity, 10);
    if (category) material.category = category;
    if (location) material.distributionLocation = location.trim();
    if (status) material.status = status;

    await material.save();

    res.status(200).json({
      success: true,
      message: 'Relief Material updated successfully.',
      material,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete relief material
// @route   DELETE /api/relief/:id
// @access  Private (Owner/Admin)
const deleteReliefMaterial = async (req, res, next) => {
  try {
    const material = await ReliefMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Relief material not found.',
      });
    }

    if (
      req.user.role !== 'ADMIN' &&
      material.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot delete this relief material.',
      });
    }

    await ReliefMaterial.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Relief Material removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all relief materials (Admin only)
// @route   GET /api/admin/relief
// @access  Private (Admin)
const getAllReliefAdmin = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { materialName: { $regex: search, $options: 'i' } },
        { distributionLocation: { $regex: search, $options: 'i' } },
        { materialId: { $regex: search, $options: 'i' } },
      ];
    }

    const materials = await ReliefMaterial.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: materials.length,
      materials,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReliefMaterial,
  getReliefSummary,
  getMyReliefMaterials,
  getReliefMaterialById,
  updateReliefMaterial,
  deleteReliefMaterial,
  getAllReliefAdmin,
};
