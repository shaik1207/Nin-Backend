const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'your_super_secret_key';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

// =========================
// USER REGISTER
// =========================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists.',
      });
    }

    const user = await User.create({
      name: name || email.split('@')[0],
      email,
      password,
      role: role || 'customer',
      isActive: true,
    });

    const userData = user.toJSON();

    delete userData.password;

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token: generateToken(user),
      user: userData,
    });
  } catch (error) {
    console.error('❌ Register Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// USER LOGIN
// =========================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account disabled.',
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const userData = user.toJSON();

    delete userData.password;

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token: generateToken(user),
      user: userData,
    });
  } catch (error) {
    console.error('❌ Login Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// GOOGLE AUTH
// =========================
exports.googleAuth = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      });
    }

    let user = await User.findOne({
      where: { email },
    });

    if (!user) {
      const randomPassword =
        Math.random().toString(36).slice(-8);

      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: randomPassword,
        role: 'customer',
        isActive: true,
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account disabled.',
      });
    }

    const userData = user.toJSON();

    delete userData.password;

    return res.status(200).json({
      success: true,
      message: 'Google login successful.',
      token: generateToken(user),
      user: userData,
    });
  } catch (error) {
    console.error('❌ Google Auth Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};