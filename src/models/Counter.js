const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Counter = sequelize.define('Counter', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  counterName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  staffName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Blocked', 'Locked'),
    defaultValue: 'Active'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (counter) => {
      if (counter.password) {
        const salt = await bcrypt.genSalt(10);
        counter.password = await bcrypt.hash(counter.password, salt);
      }
    },
    beforeUpdate: async (counter) => {
      if (counter.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        counter.password = await bcrypt.hash(counter.password, salt);
      }
    }
  }
});

module.exports = Counter;