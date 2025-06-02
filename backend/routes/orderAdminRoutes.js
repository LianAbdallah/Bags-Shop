const express = require('express');
const router = express.Router();
const orderAdminController = require('../controller/orderAdminController');
const { userAuth , adminAuth} = require('../middleware/auth'); 

//get all orders
router.get('/', userAuth, adminAuth, orderAdminController.getOrdersByAdmin);

module.exports = router;