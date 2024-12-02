const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const ServiceError = require('../middlewares/serviceError');
const bcrypt = require("bcryptjs");
require('dotenv').config();

const register = async (userData) => {
    let { email, password, ...data } = userData;

    const existingUser  = await userModel.findOneUser({email});

    if(existingUser && !existingUser.isDisabled)
        throw new ServiceError('회원가입 실패 - 이메일 중복', { email }, 409);

    if(existingUser && existingUser.isDisabled)
        throw new ServiceError('회원가입 실패 - 탈퇴한 사용자 입니다.', { email }, 409);

    userData.password = await bcrypt.hash(password, 10);
    const user = await userModel.createUser(userData);

    return { email: user.email, nickName: user.nickName, joinedDate: user.joinedDate }
}

const existingUserFunc = async (email) => {
    const existingUser  = await userModel.findOneUser({email});

    if(!existingUser)
        throw new ServiceError('사용자가 존재하지 않습니다', null, 401);

    if(existingUser && existingUser.isDisabled)
        throw new ServiceError('탈퇴된 사용자 입니다', null, 401);

    return existingUser;
}

const login = async (userData) => {
    const { email, password } = userData;

    const user = await existingUserFunc(email);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new ServiceError('이메일 또는 비밀번호가 올바르지 않습니다.', null, 400);
    }

    return { id: user._id, email: user.email, nickName: user.nickName, profileImage: user.profileImage };
}

const deactivateUser = async (token) => {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    const id = decoded.id;
    console.log('_id >>>>>>>>>>>>>>>>>> ', decoded);
    return await userModel.findByIdAndUpdate(id);
};

module.exports = {
    register,
    login,
    deactivateUser,
    existingUserFunc
}