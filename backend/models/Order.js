const mongoose = require('mongoose');
const orderSchema = require('../schemas/OrderSchema');

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
