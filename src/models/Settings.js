const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Settings = sequelize.define('Settings', {
  canteenName: { type: DataTypes.STRING, defaultValue: 'ICMR-NIN Smart Canteen' },
  email: { type: DataTypes.STRING, defaultValue: 'admin@icmr-nin.gov.in' },
  phone: { type: DataTypes.STRING, defaultValue: '+91 98765 43210' },
  workingHours: { type: DataTypes.STRING, defaultValue: '08:00 AM - 08:00 PM' },
  acceptingOrders: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Settings;