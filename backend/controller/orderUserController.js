const Order = require('../models/Order');
const Cart = require('../models/Cart');

// إنشاء أوردر من السلة
exports.createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentMethod } = req.body;

    const cart = await Cart.findOne({ userId }).populate('products.productId');
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }

    const order = new Order({
      userId: cart.userId,
      products: cart.products.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      })),
      paymentMethod: paymentMethod || 'cash',
      totalAmount: cart.totalAmount,
    });

    await order.save();
    await Cart.deleteOne({ _id: cart._id });

    res.status(201).json({ success: true, message: 'Order created from cart.', data: order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order.' });
  }
};

// جلب جميع الطلبات الخاصة بالمستخدم
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate('products.productId', 'name price');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};
