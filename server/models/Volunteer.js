const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema(
  {
    volunteerId: {
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
    phone: {
      type: String,
      required: [true, 'Please enter your phone number'],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: 'Phone number must contain exactly 10 digits',
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
    city: {
      type: String,
      required: [true, 'Please enter your city'],
      trim: true,
      minlength: [3, 'City must be at least 3 characters'],
      validate: {
        validator: function (v) {
          return /^[A-Za-z ]+$/.test(v);
        },
        message: 'City should contain only letters and spaces',
      },
    },
    skills: {
      type: String,
      required: [true, 'Please select your skill'],
      enum: [
        'Medical',
        'Rescue',
        'Food Distribution',
        'Communication',
        'Transportation',
        'Other',
      ],
    },
    availability: {
      type: String,
      required: [true, 'Please select your availability'],
      enum: ['Full Time', 'Part Time', 'Weekends'],
    },
    previousExperience: {
      type: String,
      required: [true, 'Please describe your previous experience'],
      trim: true,
      minlength: [10, 'Experience must be at least 10 characters'],
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate human-readable volunteerId (e.g. V-1001) before saving
volunteerSchema.pre('save', async function (next) {
  if (!this.volunteerId) {
    const count = await mongoose.model('Volunteer').countDocuments();
    this.volunteerId = `V-${1000 + count + 1}`;
  }
  next();
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;
