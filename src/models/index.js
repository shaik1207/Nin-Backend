const sequelize = require('../config/database');
const User = require('./User');
const Log = require('./Log');
const MenuItem = require('./MenuItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem'); 
const Category = require('./Category');
const Counter = require('./Counter'); 
const Settings = require('./Settings'); 

// Define Log Relationships
Log.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Log, { as: 'logs', foreignKey: 'userId', onDelete: 'CASCADE' });

// Define Order to User & Counter Relationships
Order.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Order, { as: 'orders', foreignKey: 'userId', onDelete: 'CASCADE' });

Order.belongsTo(Counter, { as: 'counter', foreignKey: 'counterId', onDelete: 'CASCADE' });
Counter.hasMany(Order, { as: 'orders', foreignKey: 'counterId', onDelete: 'CASCADE' });

// Define Order to OrderItem Relationships
Order.hasMany(OrderItem, { as: 'items', foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { as: 'order', foreignKey: 'orderId', onDelete: 'CASCADE' });

module.exports = {
  sequelize,
  User,
  Log,
  MenuItem,
  Order,
  OrderItem, 
  Category,
  Counter,
  Settings 
};