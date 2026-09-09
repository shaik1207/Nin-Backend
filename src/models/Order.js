const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: { // ✅ This is the correct column name! (Stores "ORD-123456")
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true 
  },
  counterId: { 
    type: DataTypes.UUID,
    allowNull: true 
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Preparing', 'Ready', 'Completed', 'Delivered', 'Cancelled'),
    defaultValue: 'Pending'
  },
  paymentStatus: {
    type: DataTypes.ENUM('Unpaid', 'Paid', 'Refunded'),
    defaultValue: 'Unpaid'
  }
}, { timestamps: true });

module.exports = Order;