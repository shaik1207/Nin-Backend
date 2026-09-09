const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// Manual User Registration
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email already exists." });
    }

    // Explicitly hash password to ensure consistency
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name || email.split('@')[0],
      email,
      password: hashedPassword,
      role: role || 'customer',
      isActive: true
    });

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: userResponse,
      data: userResponse,
      ...userResponse
    });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
};

// Manual User Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    if (user.isActive === false) {
      return res.status(403).json({ success: false, message: "Account disabled by Administrator." });
    }

    // Verify password securely
    let isMatch = false;
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = (user.password === password);
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const userResponse = user.toJSON();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: userResponse,     // Supports res.data.user or res.user
      data: userResponse,     // Supports res.data
      ...userResponse         // Supports direct property access like res.name
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
};

// Google Authentication
exports.googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required for Google authentication." });
    }

    let user = await User.findOne({ where: { email } });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: hashedPassword,
        role: 'customer',
        isActive: true
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({ success: false, message: "Account disabled by Administrator." });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const userResponse = user.toJSON();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "Google Authentication successful.",
      token,
      user: userResponse,
      data: userResponse,
      ...userResponse
    });
  } catch (error) {
    console.error("❌ Google Auth Error:", error.message);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
};