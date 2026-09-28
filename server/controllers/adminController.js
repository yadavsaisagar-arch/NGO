const User = require('../models/User');
const EmergencyRequest = require('../models/EmergencyRequest');
const Volunteer = require('../models/Volunteer');
const ReliefMaterial = require('../models/ReliefMaterial');
const ContactMessage = require('../models/ContactMessage');

// @desc    Get aggregate dashboard metrics and recent activity
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalEmergency,
      pendingRequests,
      activeOperations,
      resolvedRequests,
      totalVolunteers,
      activeVolunteers,
      totalReliefMaterials,
      reliefQtyAgg,
      unreadMessages,
      recentEmergency,
      recentVolunteers,
      recentMaterials,
      recentMessages,
    ] = await Promise.all([
      User.countDocuments(),
      EmergencyRequest.countDocuments(),
      EmergencyRequest.countDocuments({ status: 'Pending' }),
      EmergencyRequest.countDocuments({ status: 'In Progress' }),
      EmergencyRequest.countDocuments({ status: 'Resolved' }),
      Volunteer.countDocuments(),
      Volunteer.countDocuments({ status: 'Active' }),
      ReliefMaterial.countDocuments(),
      ReliefMaterial.aggregate([
        { $group: { _id: null, totalQty: { $sum: '$quantity' } } },
      ]),
      ContactMessage.countDocuments({ status: 'Unread' }),
      EmergencyRequest.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'username email'),
      Volunteer.find().sort({ createdAt: -1 }).limit(5),
      ReliefMaterial.find().sort({ createdAt: -1 }).limit(5),
      ContactMessage.find().sort({ createdAt: -1 }).limit(5),
    ]);

    const totalReliefQuantity =
      reliefQtyAgg.length > 0 ? reliefQtyAgg[0].totalQty : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalEmergency,
        pendingRequests,
        activeOperations,
        resolvedRequests,
        totalVolunteers,
        activeVolunteers,
        totalReliefMaterials,
        totalReliefQuantity,
        unreadMessages,
      },
      recent: {
        emergencyRequests: recentEmergency,
        volunteers: recentVolunteers,
        materials: recentMaterials,
        messages: recentMessages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users (Admin only)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsersList = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsersList,
};
