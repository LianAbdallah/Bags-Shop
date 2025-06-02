const Product = require('../models/Product');

// عرض جميع المنتجات
exports.getProduct= async (req, res) => {
  console.log("route hit");
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


