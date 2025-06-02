const express = require('express');
const router = express.Router();
const cartUserController = require('../controller/cartUserController');
const {userAuth} = require('../middleware/auth');


// إضافة منتج إلى السلة
router.post('/', userAuth, cartUserController.addToCart);

// الحصول على سلة المستخدم بواسطة id
router.get('/:id', userAuth ,cartUserController.getCart);

// get all cart
router.get('/', userAuth, cartUserController.getUserCart);

// تحديث الكمية
router.put('/update', userAuth,cartUserController.updateQuantity);

// حذف منتج من السلة
router.delete('/:cartId/:productId', userAuth,cartUserController.removeFromCart);


module.exports = router;
