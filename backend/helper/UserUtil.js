const User = require('../models/User');
const bcrypt = require('bcryptjs');
const RoleEnum = require('../enums/RoleEnum');

class UserUtil{
static createUser = async function({email, password, fullName, role =RoleEnum.USER, phone, userName} = userBody){
        const userModel = new User();
        const userExists = (await userModel.whereMore({email}))?.[0];//get user using email from DB
        if (userExists){
                throw new Error('User already exists')
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.create({email, password: hashedPassword, fullName, role, phone, userName})//save it with bcrypt password
        
}
}
module.exports = UserUtil;