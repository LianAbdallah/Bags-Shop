const express = require('express');
const router = express.Router();
const productAdminController = require('../controller/productAdminController');
const { userAuth, adminAuth } = require('../middleware/auth');
const upload = require('../helper/uploadFiles'); // ← إضافة رفع الصور

// ⬇️ إضافة منتج مع صورة
router.post('/', userAuth, adminAuth, upload.single('image'), productAdminController.createProduct);

// ⬇️ تعديل منتج مع صورة جديدة (اختياري)
router.put('/:id', userAuth, adminAuth, upload.single('image'), productAdminController.updateProduct);

// حذف منتج
router.delete('/:id', userAuth, adminAuth, productAdminController.deleteProduct);

// عرض كل المنتجات
router.get('/', userAuth, adminAuth, productAdminController.getAllProducts);

// عرض منتج بالـ ID
router.get('/:id', userAuth, adminAuth, productAdminController.getProductById);

module.exports = router;
