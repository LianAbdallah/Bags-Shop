const Order = require('../models/Order');

// جلب كل الطلبات (للأدمن)
exports.getOrdersByAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('products.productId', 'name price');

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ success: false, message: 'Failed to get orders' });
  }
};