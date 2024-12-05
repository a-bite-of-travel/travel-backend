const userService = require("../services/userService");

//회원가입
const register = async (req, res, next) => {
    console.log('register');
    console.log('req.file.path  >>>>>>>>>>>>>>.. ', req.file.path );

    try {
        const user = await userService.register(req.body, req.file.path);
        res.status(201).json({ message: '회원가입 성공', data: user});
    } catch (err) {
        next(err);
    }
}

//회원탈퇴
const deactivateUser = async (req, res, next) => {
    try {
        const token = req.accessToken;
        const result = await userService.deactivateUser(token);
        res.status(200).json({ message: "회원탈퇴가 완료되었습니다.", data: result });
    } catch (err) {
       next(err);
    }
};

module.exports = {
    register,
    deactivateUser
}; 