const UserModel = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userModel = new UserModel();



class AuthController {
  static async login(req, res) {
    console.log('Login request body:', req.body);
    const { email, password } = req.body;

    try {
      // البحث عن المستخدم باستخدام البريد الإلكتروني
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // مقارنة كلمة السر المدخلة مع المشفرة في قاعدة البيانات
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // إنشاء توكن JWT مع بيانات المستخدم
      const token = jwt.sign(
        { email: user.email, role: user.role, id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      // تحديث تاريخ آخر تسجيل دخول
      user.lastLogin = new Date();
      await user.save();

      // إرسال التوكن في الاستجابة
      res.json({ success: true, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async register(req, res) {
    try {
      const { password, ...rest } = req.body;

      // تشفير كلمة السر قبل الحفظ
      const hashedPassword = await bcrypt.hash(password, 10);

      // دمج البيانات مع كلمة السر المشفرة
      const userData = { ...rest, password: hashedPassword };

      await userModel.create(userData);

      res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = AuthController;
