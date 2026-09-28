const Volunteer = require('../models/Volunteer');

// @desc    Register or update volunteer profile
// @route   POST /api/volunteers
// @access  Private (User/Admin)
const registerVolunteer = async (req, res, next) => {
  try {
    const {
      fullName,
      phone,
      email,
      city,
      skills,
      availability,
      previousExperience,
    } = req.body;

    // Field validations
    if (!fullName || fullName.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 6 characters.',
      });
    }

    if (!/^[A-Za-z ]+$/.test(fullName.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Full name should contain only letters.',
      });
    }

    if (!phone || !/^[0-9]{10}$/.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must contain exactly 10 digits.',
      });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    if (!city || city.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'City must be at least 3 characters.',
      });
    }

    if (!/^[A-Za-z ]+$/.test(city.trim())) {
      return res.status(400).json({
        success: false,
        message: 'City should contain only letters.',
      });
    }

    if (!skills) {
      return res.status(400).json({
        success: false,
        message: 'Please select your skill.',
      });
    }

    if (!availability) {
      return res.status(400).json({
        success: false,
        message: 'Please select your availability.',
      });
    }

    if (!previousExperience || previousExperience.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Experience must be at least 10 characters.',
      });
    }

    // Check if volunteer profile already exists for this user
    let volunteer = await Volunteer.findOne({ userId: req.user._id });

    if (volunteer) {
      // Update existing volunteer details
      volunteer.fullName = fullName.trim();
      volunteer.phone = phone.trim();
      volunteer.email = email.toLowerCase().trim();
      volunteer.city = city.trim();
      volunteer.skills = skills;
      volunteer.availability = availability;
      volunteer.previousExperience = previousExperience.trim();
      await volunteer.save();

      return res.status(200).json({
        success: true,
        message: 'Volunteer Profile Updated Successfully!',
        volunteerId: volunteer.volunteerId,
        volunteer,
      });
    }

    // Create new volunteer profile
    volunteer = await Volunteer.create({
      userId: req.user._id,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      city: city.trim(),
      skills,
      availability,
      previousExperience: previousExperience.trim(),
      status: 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Volunteer Registration Successful!',
      volunteerId: volunteer.volunteerId,
      volunteer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's volunteer profile
// @route   GET /api/volunteers/my
// @access  Private
const getMyVolunteerProfile = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findOne({ userId: req.user._id });
    res.status(200).json({
      success: true,
      volunteer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all volunteers (Admin only)
// @route   GET /api/admin/volunteers
// @access  Private (Admin)
const getAllVolunteers = async (req, res, next) => {
  try {
    const { status, skill, search } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (skill && skill !== 'all') {
      query.skills = skill;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { volunteerId: { $regex: search, $options: 'i' } },
      ];
    }

    const volunteers = await Volunteer.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: volunteers.length,
      volunteers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update volunteer status (Admin only)
// @route   PATCH /api/admin/volunteers/:id/status
// @access  Private (Admin)
const updateVolunteerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either Active or Inactive.',
      });
    }

    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer record not found.',
      });
    }

    volunteer.status = status;
    await volunteer.save();

    res.status(200).json({
      success: true,
      message: `Volunteer status set to ${status}.`,
      volunteer,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerVolunteer,
  getMyVolunteerProfile,
  getAllVolunteers,
  updateVolunteerStatus,
};
