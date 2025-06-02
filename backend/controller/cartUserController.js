const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// إضافة منتج إلى السلة

exports.addToCart = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);  // تحويل النص لـ ObjectId
    console.log("User ID as ObjectId:", userId);

    const { products, paymentMethod } = req.body;

    if (!userId || !products || products.length === 0 || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Please provide all required fields." });
    }

    let totalAmount = 0;
    const cartItems = [];

    for (const item of products) {
      const productId = new mongoose.Types.ObjectId(item.productId); // تأكد من تحويل كل productId
      const quantity = item.quantity || 1;

      if (!productId) {
        return res.status(400).json({ success: false, message: "Each product must include a productId." });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${productId}` });
      }

      totalAmount += product.price * quantity;
      cartItems.push({ productId: product._id, quantity });
    }

    const existingCart = await Cart.findOne({ userId });
    console.log("Existing cart found:", existingCart);

    if (existingCart) {
      for (const newItem of cartItems) {
        const existingItem = existingCart.products.find(item =>
          item.productId.toString() === newItem.productId.toString()
        );
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          existingCart.products.push(newItem);
        }
      }

      existingCart.totalAmount += totalAmount;

      try {
        console.log('Before save:', existingCart);
        const updatedCart = await existingCart.save();
        console.log('After save:', updatedCart);
        console.log('Cart updated and saved:', updatedCart);
        console.log('Cart updated and saved:', updatedCart);

       const refreshedCart = await Cart.findOne({ userId });
       console.log('Refreshed cart from DB:', refreshedCart);

        // إرجاع الرد هنا ومنع تنفيذ الكود التالي
        return res.status(200).json({ success: true, data: updatedCart });

      } catch (saveError) {
        console.error('Error saving cart:', saveError);
        return res.status(500).json({ success: false, message: 'Failed to save updated cart.' });
      }
    }

    // إذا ما في كارت سابق، ننشئ كارت جديد
    const newCart = new Cart({
      userId,
      products: cartItems,
      paymentMethod,
      totalAmount,
    });

    const savedCart = await newCart.save();
    console.log("New cart created and saved:", savedCart);
    res.status(201).json({ success: true, data: savedCart });

  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Failed to create or update cart." });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);  // تحويل النص لـ ObjectId
    const cart = await Cart.findOne({ userId })
      .populate('products.productId', 'name price');

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found." });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error('Error fetching user cart:', error);
    res.status(500).json({ success: false, message: 'Failed to get user cart' });
  }
};


// الحصول على سلة المستخدم
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id)
      .populate('userId')
      .populate('products');
console.log('cart', cart)
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found." });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to get cart." });
  }
};

// تحديث الكمية في السلة
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId or productId' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    const updatedCart = await Cart.findOneAndUpdate(
      { userId: userObjectId, 'products.productId': productObjectId },
      {
        $set: {
          'products.$.quantity': quantity,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ success: false, message: 'Cart or product not found' });
    }

    // إعادة حساب المجموع
    let totalAmount = 0;
    for (const item of updatedCart.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        totalAmount += product.price * item.quantity;
      }
    }
    updatedCart.totalAmount = totalAmount;
    await updatedCart.save();

    return res.status(200).json({ success: true, message: 'Quantity updated', cart: updatedCart });

  } catch (error) {
    console.error('Error updating quantity:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// حذف منتج من السلة
exports.removeFromCart = async (req, res) => {
  const { cartId, productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cartId)) {
    return res.status(400).json({ message: 'cartId غير صالح.' });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'productId غير صالح.' });
  }

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'السلة غير موجودة.' });
    }

    const originalLength = cart.products.length;

    // حذف المنتج من المصفوفة
    cart.products = cart.products.filter(item => item.productId.toString() !== productId);

    if (cart.products.length === originalLength) {
      return res.status(404).json({ message: 'المنتج غير موجود في السلة.' });
    }

    // تحديث المجموع بعد حذف المنتج
    let totalAmount = 0;
    for (const item of cart.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        totalAmount += product.price * item.quantity;
      }
    }
    cart.totalAmount = totalAmount;

    await cart.save();

    if (cart.products.length === 0) {
   await Cart.findByIdAndDelete(cart._id);
   return res.status(200).json({ message: 'تم حذف المنتج والسلة لأن السلة أصبحت فارغة.' });
}

    res.status(200).json({ message: 'تم حذف المنتج من السلة بنجاح.', cart });
  } catch (error) {
    console.error('خطأ في حذف المنتج من السلة:', error);
    res.status(500).json({ message: 'حدث خطأ في السيرفر.' });
  }

};
