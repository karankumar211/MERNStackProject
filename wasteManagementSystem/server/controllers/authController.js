// server/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Authenticate user & get token (login)
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// --- THIS IS THE MISSING FUNCTION ---
// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin (for now, public for hackathon)
exports.getAllUsers = async (req, res) => {
  try {
    // We exclude the password field from the result
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error)
  {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};