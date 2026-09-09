const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models'); 

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// Helper: Safely formats the ID
const formatEmployeeEmail = (empId) => {
  const cleanId = String(empId).toLowerCase().trim();
  if (cleanId.includes('@')) return cleanId; 
  return `${cleanId}@canteen.nin.in`;
};

// ==========================================
// REGISTER COUNTER STAFF
// ==========================================
exports.registerCounterStaff = async (req, res, next) => {
  try {
    const { name, employeeId, password } = req.body; 
    
    if (!name || !employeeId || !password) {
      return res.status(400).json({ success: false, message: "Please provide all required fields." });
    }

    const dbEmail = formatEmployeeEmail(employeeId);

    // 1. Check if employee ID already exists
    const existingUser = await User.findOne({ where: { email: dbEmail } }); 
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Employee ID already registered. Please login." });
    }

    // 2. Create User in Database
    // Sequelize User model will hash the password automatically via the beforeCreate hook
    const newStaff = await User.create({
      name: name,
      email: dbEmail, 
      password: password, 
      role: 'inventory_staff', 
      isActive: true 
    });

    return res.status(201).json({ 
      success: true, 
      message: "Staff registered successfully." 
    });

  } catch (error) {
    console.error("Counter Registration Crash:", error);
    const errorMsg = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
    return res.status(500).json({ success: false, message: `Database Error: ${errorMsg}` });
  }
};

// ==========================================
// LOGIN COUNTER STAFF
// ==========================================
exports.loginCounterStaff = async (req, res, next) => {
  try {
    const { employeeId, password } = req.body;
    
    if (!employeeId || !password) {
      return res.status(400).json({ success: false, message: "Please provide credentials." });
    }

    const dbEmail = formatEmployeeEmail(employeeId);

    // 1. Find User by Formatted ID / Email
    const user = await User.findOne({ where: { email: dbEmail } });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found. Please check your Employee ID." });
    }

    // 2. ROLE SEPARATION: Explicitly Block Admins from Counter Panel
    const adminRoles = ['admin', 'convener', 'co_convener', 'member_secretary', 'member'];
    if (adminRoles.includes(user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: "Access Denied: Admins must use the Web Admin Portal, not the POS Terminal." 
      });
    }

    // 3. Check if Admin disabled the account
    if (user.isActive === false) {
      return res.status(403).json({ success: false, message: "Account disabled by Administrator." });
    }

    // 4. Verify Password
    let isMatch = false;
    if (typeof user.matchPassword === 'function') {
      isMatch = await user.matchPassword(password);
    } else {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password." });
    }

    // 5. Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        employeeId: employeeId, 
        role: user.role
      }
    });

  } catch (error) {
    console.error("Counter Login Error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error during login." });
  }
};