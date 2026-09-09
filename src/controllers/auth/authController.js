const { User, Counter } = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'icmr_nin_secret_key_2026';

// ---------------------------------------------------------
// 1. USER (CUSTOMER) REGISTRATION (Sign Up)
// ---------------------------------------------------------
exports.userRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user with a default 'customer' role
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'customer',
      isActive: true
    });

    // Generate JWT token for immediate login after signup
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ 
      success: true, 
      token, 
      user: { id: newUser.id, name: newUser.name, role: newUser.role, email: newUser.email } 
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------
// 2. USER (CUSTOMER) PORTAL LOGIN
// ---------------------------------------------------------
exports.userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Account not found.' });

    if (!user.isActive) return res.status(403).json({ success: false, message: 'Your account has been deactivated.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Incorrect password.' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({ success: true, token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------
// 3. USER (CUSTOMER) GOOGLE LOGIN
// ---------------------------------------------------------
exports.googleLogin = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    
    let user = await User.findOne({ where: { email } });
    
    // Auto-register new Google users as 'customer'
    if (!user) {
      user = await User.create({
        name,
        email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-12), 10), 
        role: 'customer',
        isActive: true
      });
    } else if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account deactivated. Contact support.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({ success: true, token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------
// 4. ADMIN PORTAL LOGIN
// ---------------------------------------------------------
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    // Strict Role Validation
    const adminRoles = ['admin', 'super_admin', 'manager'];
    if (!adminRoles.includes(user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
    }

    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account disabled.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ success: true, token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------
// 5. COUNTER PORTAL LOGIN
// ---------------------------------------------------------
exports.counterLogin = async (req, res, next) => {
  try {
    const { counterName, password } = req.body;

    const counter = await Counter.findOne({ where: { counterName } });
    if (!counter) return res.status(401).json({ success: false, message: 'Counter system not found.' });

    // Enforce Security Status Locks
    if (counter.status === 'Blocked') {
      return res.status(403).json({ success: false, message: 'SYSTEM BLOCKED. Please contact the administrator.' });
    }
    if (counter.status === 'Locked') {
      return res.status(403).json({ success: false, message: 'System is asleep/locked. Wake system from Admin panel first.' });
    }

    const isMatch = await bcrypt.compare(password, counter.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid counter credentials.' });

    // Automatically set status to Active on successful login if it was inactive
    if (counter.status === 'Inactive') {
      counter.status = 'Active';
      await counter.save();
    }

    const token = jwt.sign({ id: counter.id, role: 'counter_system' }, JWT_SECRET, { expiresIn: '12h' });

    res.status(200).json({ 
      success: true, 
      token, 
      counter: { id: counter.id, name: counter.counterName, staff: counter.staffName, location: counter.location } 
    });
  } catch (error) {
    next(error);
  }
};