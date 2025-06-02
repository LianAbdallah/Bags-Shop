const jwt = require('jsonwebtoken');
const RoleEnum = require('../enums/RoleEnum');
require('dotenv').config();

const userAuth = function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // console.log(decoded)
        next();
    } catch (err) {
        console.log(err)
        res.status(401).json({ message: 'Invalid token' });
    }
};

const adminAuth = function (req, res, next) {
    const role = req.user.role;
    if(role && RoleEnum.ADMIN === role){
        next();
    } else{
        res.status(443).json({ message: 'Access Denail Admins only.' });
    }
};


module.exports = {userAuth, adminAuth}
