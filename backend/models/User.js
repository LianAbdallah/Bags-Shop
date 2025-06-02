// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   fullName: String,
//   userName: String,
//   password: String,
//   phone: String,
//   createAt: { type: Date, default: Date.now },
//   lastLogin: { type: Date, default: null },
//   role: { type: String, default: 'user' } // يمكن تجاهل role الآن
// });

// // تشفير كلمة المرور
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // مقارنة كلمة المرور
// userSchema.methods.comparePassword = function (password) {
//   return bcrypt.compare(password, this.password);
// };

// module.exports = mongoose.model('User', userSchema);

const User = require('../schemas/UserSchema');
const BaseModel = require("./BaseModel.js");

class UserModel extends BaseModel {
    constructor() {
        super(User);
    }
}

module.exports = UserModel;

