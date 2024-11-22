const userModel = require('../schemas/user');

const createUser = async (userData) => {
    const user = new userModel(userData);
    return await user.save();
};

const findUserByEmail = async (email) => {
    return await userModel.findOne({ email });
};

const findByIdAndUpdate = async (userId) => {
      return await userModel.findByIdAndUpdate(
        userId, 
        { isDisabled: true, deletedAt: new Date() }, 
        { new: true }
    );
};

module.exports = {
    createUser,
    findUserByEmail,
    findByIdAndUpdate
};