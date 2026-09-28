const EmergencyRequest = require('../models/EmergencyRequest');

// @desc    Create new emergency request
// @route   POST /api/emergency
// @access  Private (User/Admin)
const createEmergencyRequest = async (req, res, next) => {
  try {
    const {
      fullName,
      phone,
      location,
      address,
      disasterType,
      numberOfPeople,
      requiredHelp,
      description,
    } = req.body;

    // Backend field validations
    if (!fullName || fullName.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 6 characters.',
      });
    }

    if (!/^[A-Za-z ]+$/.test(fullName.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Full name should contain only letters and spaces.',
      });
    }

    if (!phone || !/^[0-9]{10}$/.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must contain exactly 10 digits.',
      });
    }

    if (!location || location.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Location must be at least 6 characters.',
      });
    }

    if (!address || address.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Address must be at least 10 characters.',
      });
    }

    if (!/[A-Za-z]/.test(address) || !/[0-9]/.test(address)) {
      return res.status(400).json({
        success: false,
        message: 'Address must contain both letters and numbers.',
      });
    }

    if (!disasterType) {
      return res.status(400).json({
        success: false,
        message: 'Please select a disaster type.',
      });
    }

    const peopleCount = parseInt(numberOfPeople, 10);
    if (isNaN(peopleCount) || peopleCount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Number of people must be at least 1.',
      });
    }

    if (!requiredHelp) {
      return res.status(400).json({
        success: false,
        message: 'Please select the required help.',
      });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please describe your emergency situation.',
      });
    }

    const newRequest = await EmergencyRequest.create({
      userId: req.user._id,
      fullName: fullName.trim(),
      phone: phone.trim(),
      location: location.trim(),
      address: address.trim(),
      disasterType,
      numberOfPeople: peopleCount,
      requiredHelp,
      description: description.trim(),
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Emergency Request Submitted Successfully!',
      requestId: newRequest.requestId,
      request: newRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's own emergency requests
// @route   GET /api/emergency/my
// @access  Private (User/Admin)
const getMyEmergencyRequests = async (req, res, next) => {
  try {
    const requests = await EmergencyRequest.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single emergency request by ID (enforcing ownership)
// @route   GET /api/emergency/:id
// @access  Private
const getEmergencyRequestById = async (req, res, next) => {
  try {
    const request = await EmergencyRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Emergency request not found.',
      });
    }

    // Strict ownership verification:
    // Only the owner or an administrator can view this request
    if (
      req.user.role !== 'ADMIN' &&
      request.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view this request.',
      });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all emergency requests (Admin only)
// @route   GET /api/admin/emergency
// @access  Private (Admin)
const getAllEmergencyRequests = async (req, res, next) => {
  try {
    const { status, disasterType, search } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (disasterType && disasterType !== 'all') {
      query.disasterType = disasterType;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { requestId: { $regex: search, $options: 'i' } },
      ];
    }

    const requests = await EmergencyRequest.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update emergency request status (Admin only)
// @route   PATCH /api/admin/emergency/:id/status
// @access  Private (Admin)
const updateEmergencyRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    const request = await EmergencyRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Emergency request not found.',
      });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      message: `Request status updated to ${status}.`,
      request,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmergencyRequest,
  getMyEmergencyRequests,
  getEmergencyRequestById,
  getAllEmergencyRequests,
  updateEmergencyRequestStatus,
};
