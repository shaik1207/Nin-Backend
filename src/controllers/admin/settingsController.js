const { Settings } = require('../../models');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // Auto-create default settings if the database is completely empty
    if (!settings) {
      settings = await Settings.create({
        canteenName: 'ICMR-NIN Smart Canteen',
        email: 'admin@icmr-nin.gov.in',
        phone: '+91 98765 43210',
        workingHours: '08:00 AM - 08:00 PM',
        acceptingOrders: true
      }); 
    }
    
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error("❌ Admin Settings Fetch Error:", error.message);
    return res.status(500).json({ success: false, message: `DB Error: ${error.message}` });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    
    await settings.update(req.body);
    
    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error("❌ Admin Settings Update Error:", error.message);
    return res.status(500).json({ success: false, message: `DB Error: ${error.message}` });
  }
};