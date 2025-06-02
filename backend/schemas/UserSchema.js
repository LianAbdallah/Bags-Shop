const mongoose = require('mongoose');
const RoleEnum = require('../enums/RoleEnum');
//const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: String,
  userName: String,
  password: String,
  phone: String,
  createAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
  role: { type: String, default: RoleEnum.USER } 
});

module.exports = mongoose.model('User', userSchema);