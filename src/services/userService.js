const userModel = require("../models/userModel");
const mongoose = require('mongoose');

const findAll = async () => {
    return await userModel.findAll();
}
const createUser = async (userData) => {
    return await userModel.createUser(userData);
}

const findUserByEmail = async (email) => {
    return await userModel.findUserByEmail(email);
}

const softDeleteUser = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("유효하지 않은 사용자 ID입니다.");
    }

    return await userModel.findByIdAndUpdate(
        userId,
        { isDisabled: true, deletedAt: new Date() },
        { new: true }
    );
};

module.exports = {
    findAll,
    createUser,
    findUserByEmail,
    softDeleteUser,
}