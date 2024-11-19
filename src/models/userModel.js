const userModel = require('../schemas/user');

const createUser = async (userData) => {
    const user = new userModel(userData);
    return await user.save();
};

const findUserByEmail = async (email) => {
    return await userModel.findOne({ email });
};

module.exports = {
    createUser,
    findUserByEmail
};