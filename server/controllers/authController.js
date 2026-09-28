const User = require('../models/User');
const { sendTokenResponse } = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { fullName, email, username, password } = req.body;

    // Field presence checks
    if (!fullName || !email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, username, and password.',
      });
    }

    // Validation rules
    if (fullName.trim().length < 6) {
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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters.',
      });
    }

    if (!/^[A-Za-z0-9_]+$/.test(username.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Username should contain only letters, numbers, and underscores.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { username: username.toLowerCase().trim() },
      ],
    });

    if (existingUser) {
      const matchField =
        existingUser.email === email.toLowerCase().trim()
          ? 'Email'
          : 'Username';
      return res.status(400).json({
        success: false,
        message: `${matchField} already registered. Please use another one or login.`,
      });
    }

    // Create user
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      username: username.toLowerCase().trim(),
      passwordHash: password,
      role: 'USER',
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password.',
      });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: username.trim().toLowerCase() },
        { email: username.trim().toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully.',
  });
};

// @desc    Get currently logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// @desc    Seed initial Admin account if none exists
const seedInitialAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'ADMIN' });
    if (!adminExists) {
      await User.create({
        fullName: 'System Administrator',
        email: 'admin@ngodisaster.org',
        username: 'admin',
        passwordHash: 'admin123',
        role: 'ADMIN',
      });
      console.log('[Seed] Default admin account initialized (username: admin)');
    }
  } catch (error) {
    console.error('[Seed Error] Failed to seed admin:', error.message);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  seedInitialAdmin,
};
