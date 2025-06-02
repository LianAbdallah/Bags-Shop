const express = require('express');
const router = express.Router();
const productUserController = require('../controller/productUserController');
const { userAuth } = require('../middleware/auth'); 

// الحصول على جميع المنتجات
router.get('/', userAuth,productUserController.getProduct);



module.exports = router;