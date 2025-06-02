const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db.js');
const upload = require('./helper/uploadFiles'); // multer

dotenv.config(); // تحميل متغيرات البيئة

const app = express(); // ✅ تعريف التطبيق أولاً

app.use(express.json());
app.use(cors());

console.log("Uploads Path:", path.join(__dirname, 'uploads'));

// ✅ توفير ملفات الصور مباشرة من مجلد uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// الاتصال بقاعدة البيانات
connectDB();

// ✅ استدعاء ملفات المسارات
const authRoutes = require('./routes/authRoutes.js');
const productUserRoutes = require('./routes/productUserRoutes.js');
const cartUserRoutes = require('./routes/cartUserRoutes.js');
const orderUserRoutes = require('./routes/orderUserRoutes.js');
const productAdminRoutes = require('./routes/productAdminRoutes.js');
const orderAdminRoutes = require('./routes/orderAdminRoutes.js');

// ✅ تسجيل المسارات
app.use('/auth', authRoutes);
app.use('/productUser', productUserRoutes);
app.use('/cartUser', cartUserRoutes);
app.use('/orderUser', orderUserRoutes);
app.use('/productAdmin', productAdminRoutes);
app.use('/orderAdmin', orderAdminRoutes);

// ✅ نقطة رفع الصور
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ message: 'Image uploaded successfully', imageUrl });
});

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
