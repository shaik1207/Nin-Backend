const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MenuItem = sequelize.define('MenuItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  badge: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // ✅ NEW FIELD: Stores the scheduled day for the Weekly Menu
  day: {
    type: DataTypes.STRING,
    defaultValue: 'Everyday'
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false, // Stores the URL/path to the image
  },
  status: {
    type: DataTypes.ENUM('Available', 'Unavailable'),
    defaultValue: 'Available'
  }
}, { timestamps: true });

module.exports = MenuItem;