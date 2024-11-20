const userModel = require("../models/userModel");

const createUser = async (userData) => {
    return await userModel.createUser(userData);
}

const findUserByEmail = async(email) =>{
    return await userModel.findUserByEmail(email);
}

module.exports = {
    createUser,
    findUserByEmail
}