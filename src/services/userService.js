const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');

//회원가입
const createUser = async ({ email, password, nickName, profile_img }) => {
    // 중복 이메일 확인
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
        throw new Error('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 12);

    //사용자 생성
    const user = await userModel.createUser({
        email,
        password: hashedPassword,
        nickName,
        profile_img
    });
    return { message: '회원가입 성공!', userId: user._id };
}


module.exports = {
    createUser
};