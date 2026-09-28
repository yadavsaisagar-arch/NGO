const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
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
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please enter a valid email address',
      },
    },
    username: {
      type: String,
      required: [true, 'Please create a username'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      validate: {
        validator: function (v) {
          return /^[A-Za-z0-9_]+$/.test(v);
        },
        message: 'Username should contain only letters, numbers, and underscores',
      },
    },
    passwordHash: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  {
    timestamps: true,
  }
);

// Match user entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Remove passwordHash from JSON responses
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
