const userModel = require('../schemas/user');

const findAll = async () => {
    return await userModel.find({});
}

const createUser = async (userData) => {
    const user = new userModel(userData);
    return await user.save();
};

const findOneUser = async (cond) => {
    return await userModel.findOne(cond);
}

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
    findAll,
    createUser,
    findOneUser,
    findUserByEmail,
    findByIdAndUpdate,
};