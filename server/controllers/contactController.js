const ContactMessage = require('../models/ContactMessage');

// @desc    Submit a contact message (Public or authenticated)
// @route   POST /api/contact
// @access  Public
const createContactMessage = async (req, res, next) => {
  try {
    const { fullName, email, message } = req.body;

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

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    if (!message || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 10 characters.',
      });
    }

    const newMessage = await ContactMessage.create({
      userId: req.user ? req.user._id : undefined,
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      message: message.trim(),
      status: 'Unread',
    });

    res.status(201).json({
      success: true,
      message: 'Message Sent Successfully!',
      contactMessage: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages (Admin only)
// @route   GET /api/admin/contact
// @access  Private (Admin)
const getAllContactMessages = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const messages = await ContactMessage.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact message status (Admin only)
// @route   PATCH /api/admin/contact/:id/status
// @access  Private (Admin)
const updateContactMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Unread', 'Read', 'Archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Unread, Read, or Archived.',
      });
    }

    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({
        success: false,
        message: 'Message not found.',
      });
    }

    msg.status = status;
    await msg.save();

    res.status(200).json({
      success: true,
      message: `Message status updated to ${status}.`,
      contactMessage: msg,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message (Admin only)
// @route   DELETE /api/admin/contact/:id
// @access  Private (Admin)
const deleteContactMessage = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) {
      return res.status(404).json({
        success: false,
        message: 'Message not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContactMessage,
  getAllContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
};
