const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please enter full name'],
      trim: true,
      minlength: [6, 'Full name must be at least 6 characters'],
      validate: {
        validator: function (v) {
          return /^[A-Za-z ]+$/.test(v);
        },
        message: 'Full name should contain only letters and spaces',
      },
    },
    phone: {
      type: String,
      required: [true, 'Please enter phone number'],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: 'Phone number must contain exactly 10 digits',
      },
    },
    location: {
      type: String,
      required: [true, 'Please enter location'],
      trim: true,
      minlength: [6, 'Location must be at least 6 characters'],
    },
    address: {
      type: String,
      required: [true, 'Please enter address'],
      trim: true,
      minlength: [10, 'Address must be at least 10 characters'],
      validate: {
        validator: function (v) {
          return /[A-Za-z]/.test(v) && /[0-9]/.test(v);
        },
        message: 'Address must contain both letters and numbers',
      },
    },
    disasterType: {
      type: String,
      required: [true, 'Please select a disaster type'],
      enum: ['Flood', 'Earthquake', 'Fire', 'Cyclone', 'Landslide', 'Other'],
    },
    numberOfPeople: {
      type: Number,
      required: [true, 'Please enter number of people'],
      min: [1, 'Number of people must be at least 1'],
    },
    requiredHelp: {
      type: String,
      required: [true, 'Please select required help'],
      enum: ['Food', 'Water', 'Medical', 'Shelter', 'Rescue', 'Other'],
    },
    description: {
      type: String,
      required: [true, 'Please describe your emergency situation'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate human-readable requestId (e.g. ER-1001) before saving
emergencyRequestSchema.pre('save', async function (next) {
  if (!this.requestId) {
    const count = await mongoose.model('EmergencyRequest').countDocuments();
    this.requestId = `ER-${1000 + count + 1}`;
  }
  next();
});

const EmergencyRequest = mongoose.model(
  'EmergencyRequest',
  emergencyRequestSchema
);

module.exports = EmergencyRequest;
