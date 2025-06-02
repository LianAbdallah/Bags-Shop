const mongoose = require('mongoose');
const cartSchema = require('../schemas/CartSchema');

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart


