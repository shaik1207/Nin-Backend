const { Order, OrderItem, User } = require('../../models');

exports.createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount, paymentMethod, userId: reqUserId } = req.body;
    
    let userId = (req.user && req.user.id) || reqUserId;
    if (!userId || userId === 'guest' || userId === 'null' || userId === 'undefined') {
      userId = null; 
    }

    const generatedOrderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    const newOrder = await Order.create({
      orderId: generatedOrderId,
      userId: userId, 
      totalAmount: totalAmount || 0,
      paymentMethod: paymentMethod || 'upi',
      status: 'Pending' 
    });

    if (items && items.length > 0) {
      const orderItemsData = items.map(item => ({
        orderId: newOrder.id, 
        name: item.name || 'Unknown Item',
        price: item.price || 0,
        quantity: item.quantity || 1
      }));
      
      await OrderItem.bulkCreate(orderItemsData);
    }

    return res.status(201).json({
      success: true,
      data: {
        orderId: generatedOrderId,
        totalAmount: newOrder.totalAmount,
        paymentMethod: newOrder.paymentMethod,
        createdAt: newOrder.createdAt 
      }
    });

  } catch (error) {
    console.error("\n❌ EXACT DATABASE CRASH ERROR:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: `DB Error: ${error.message}` 
    });
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    let userId = (req.user && req.user.id) || req.query.userId;

    if (!userId || userId === 'guest' || userId === 'null' || userId === 'undefined') {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const orders = await Order.findAll({
      where: { userId: userId },
      include: [
        { 
          model: OrderItem, 
          as: 'items',
          attributes: ['id', 'name', 'price', 'quantity'] 
        },
        { 
          model: User, 
          as: 'user', 
          attributes: ['id', 'name', 'email'] 
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error("\n❌ EXACT DATABASE CRASH ERROR (FETCH ORDERS):", error.message);
    return res.status(500).json({ 
      success: false, 
      message: `DB Error: ${error.message}` 
    });
  }
};