const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    fullName: {
      type: String,
      required: [true, 'Please enter your full name'],
      trim: true,
      minlength: [6, 'Full name must be at least 6 characters'],
      validate: {
        validator: function (v) {
          return /^[A-Za-z ]+$/.test(v);
        },
        message: 'Full name should contain only letters and spaces',
      },
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please enter a valid email address',
      },
    },
    message: {
      type: String,
      required: [true, 'Please enter your message'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
    },
    status: {
      type: String,
      enum: ['Unread', 'Read', 'Archived'],
      default: 'Unread',
    },
  },
  {
    timestamps: true,
  }
);

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

module.exports = ContactMessage;
