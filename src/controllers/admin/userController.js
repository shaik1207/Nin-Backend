const { User } = require('../../models');

// Get all users (excluding passwords for security)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// Create a new user manually from admin panel
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const newUser = await User.create({
      name,
      email,
      password, 
      role,
      isActive: true
    });

    // Remove password from response
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    return res.status(201).json({ success: true, data: userResponse });
  } catch (error) {
    next(error);
  }
};

// Toggle Active/Inactive status (Block/Unblock)
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isActive = isActive;
    await user.save();

    return res.status(200).json({ success: true, data: { id: user.id, isActive: user.isActive } });
  } catch (error) {
    next(error);
  }
};

// Permanently delete a user
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await user.destroy();
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};