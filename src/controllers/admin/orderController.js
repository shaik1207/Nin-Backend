const { Order, OrderItem, User } = require('../../models');

const isUUID = (str) => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(str);
};

// ==========================================
// 1. FETCH ALL ORDERS
// ==========================================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem, as: 'items', attributes: ['id', 'name', 'price', 'quantity'] },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("\n❌ ADMIN DB ERROR (FETCH ALL ORDERS):", error.message);
    return res.status(500).json({ success: false, message: `DB Error: ${error.message}` });
  }
};

// ==========================================
// 2. FETCH SINGLE ORDER 
// ==========================================
exports.getOrderById = async (req, res) => {
  try {
    const identifier = req.params.id;

    // ✅ FIXED: Now properly maps "ORD-12345" to your 'orderId' column!
    const query = isUUID(identifier) ? { id: identifier } : { orderId: identifier };

    const order = await Order.findOne({
      where: query,
      include: [
        { model: OrderItem, as: 'items', attributes: ['id', 'name', 'price', 'quantity'] },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("\n❌ ADMIN DB ERROR (FETCH SINGLE ORDER):", error.message);
    return res.status(500).json({ success: false, message: `DB Error: ${error.message}` });
  }
};

// ==========================================
// 3. UPDATE ORDER STATUS
// ==========================================
exports.updateOrderStatus = async (req, res) => {
  try {
    const identifier = req.params.id;
    const { status } = req.body; 
    
    // ✅ FIXED: Now maps to 'orderId' here as well
    const query = isUUID(identifier) ? { id: identifier } : { orderId: identifier };
    
    const order = await Order.findOne({ where: query });
    
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found in database." });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });

  } catch (error) {
    console.error("\n❌ ADMIN DB ERROR (UPDATE STATUS):", error.message);
    return res.status(500).json({ success: false, message: `DB Error: ${error.message}` });
  }
};