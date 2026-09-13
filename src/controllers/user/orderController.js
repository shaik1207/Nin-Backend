const { Order, OrderItem, User } = require('../../models');
const jwt = require('jsonwebtoken');

// ✅ AGGRESSIVE EXTRACTION: Checks every possible location and key for the User ID
const extractUserId = (req) => {
  let id = req.query.userId || req.body.userId || (req.user && req.user.id);
  
  if ((!id || id === 'undefined' || id === 'null') && req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.decode(token);
      if (decoded) {
        id = decoded.id || decoded.userId || decoded._id || decoded.user_id;
      }
    } catch (e) {
      console.error("Token extraction fallback failed", e);
    }
  }
  return id;
};

exports.createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount, paymentMethod } = req.body;
    
    // Use the aggressive extraction helper
    let userId = extractUserId(req);

    if (!userId || userId === 'guest' || userId === 'null' || userId === 'undefined') {
      userId = null; 
      console.warn("⚠️ WARNING: Creating order without a valid User ID! It will be orphaned.");
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
    console.error("\n❌ EXACT DATABASE CRASH ERROR (CREATE ORDER):", error.message);
    return res.status(500).json({ success: false, message: `DB Error: ${error.message}` });
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    // Use the aggressive extraction helper
    let userId = extractUserId(req);

    if (!userId || userId === 'guest' || userId === 'null' || userId === 'undefined') {
      return res.status(200).json({ success: true, data: [] });
    }

    const orders = await Order.findAll({
      where: { userId: userId },
      include: [
        { 
          model: OrderItem, 
          as: 'items',
          attributes: ['id', 'name', 'price', 'quantity'] 
        }
        // Removed User join to prevent unnecessary database crashing
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error("\n❌ EXACT DATABASE CRASH ERROR (FETCH ORDERS):", error.message);
    return res.status(500).json({ success: false, message: `DB Error: ${error.message}` });
  }
};