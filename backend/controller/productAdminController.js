const Product = require('../models/Product');

// ✅ إنشاء منتج جديد مع دعم رفع صورة
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image: imageFromBody } = req.body;
    let image = '';

    // إذا أرسل صورة كـ ملف
    if (req.file) {
      image = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    // إذا أرسل رابط صورة في body
    else if (imageFromBody) {
      image = imageFromBody;
    }

    // التحقق من الحقول
    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image
    });

    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
};



// ✅ تحديث منتج (مع إمكانية تعديل الصورة)
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    let updatedData = { name, description, price, category };

    if (req.file) {
      updatedData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updated) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
  }
};

// ✅ حذف منتج
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};

// ✅ جلب كل المنتجات
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get products' });
  }
};

// ✅ جلب منتج حسب ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get product' });
  }
};

