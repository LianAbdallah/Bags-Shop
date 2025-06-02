const User = require('../schemas/UserSchema');
const BaseModel = require("./BaseModel");

class AdminUserModel extends BaseModel {
    constructor() {
        super(User);
    }

}

module.exports = AdminUserModel;
