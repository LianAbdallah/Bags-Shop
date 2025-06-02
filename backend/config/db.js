const mongoose = require('mongoose');
// const Product = require('../models/Product');
const express = require('express');
const app = express();
app.use(express.json());


//الاتصال بقاعدة البيانات MongoDB
const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected To MongoDB");
    
    } catch (err){
        console.error("MongoDB Connection Error", err);
        process.exit(1); 
    }
} 

module.exports = connectDB;