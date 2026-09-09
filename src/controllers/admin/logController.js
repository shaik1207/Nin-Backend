const { Log, User } = require('../../models');

exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 100 // Prevent fetching massive amounts of data at once
    });
    
    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error("❌ Admin Logs Fetch Error:", error.message);
    return res.status(500).json({ success: false, message: `DB Error: ${error.message}` });
  }
};