const express = require('express');
const router = express.Router();
const orderUserController = require('../controller/orderUserController');
const { userAuth} = require('../middleware/auth');  // استيراد الميدلوير

//  الحصول على كل الطلبات الخاصة باليوزر الحالي
router.post('/orders/from-cart',userAuth, orderUserController.createOrderFromCart);
router.get('/user-orders', userAuth, orderUserController.getUserOrders); 

module.exports = router;
