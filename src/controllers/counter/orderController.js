const { Order, OrderItem, User } = require('../../models');

// 1. SCAN AND VERIFY ORDER
exports.scanOrder = async (req, res) => {
  try {
    const { orderId, orderCode } = req.body; 

    if (!orderId && !orderCode) {
      return res.status(400).json({ success: false, message: "No scan data provided." });
    }

    const query = orderId ? { id: orderId } : { orderCode: orderCode };

    const order = await Order.findOne({
      where: query,
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
        { model: OrderItem, as: 'items', attributes: ['name', 'price', 'quantity'] }
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Invalid Code: Order not found." });
    }

    if (order.status === 'Completed' || order.status === 'Picked Up') {
      return res.status(400).json({ success: false, message: "Order has already been collected." });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("❌ Counter Scan Error:", error.message);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
};

// 2. UPDATE STATUS FROM COUNTER
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });

    order.status = status;
    await order.save();

    return res.status(200).json({ success: true, message: `Order marked as ${status}`, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};