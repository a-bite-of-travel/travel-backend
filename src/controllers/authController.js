const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const userService = require('../services/userService');
const jwt = require("jsonwebtoken");
require('dotenv').config();

//로그인
const login = async (req, res, next) => {
    try {
        const user = await userService.login(req.body);

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        console.log('login', 'user', user)

        res.status(200).json({message: '로그인 성공', data: {user, accessToken, refreshToken}})
    } catch (err) {
        next(err);
    }
};

//로그아웃
const logout = async (req, res, next) => {
    try {
        jwt.verify(req.accessToken, process.env.ACCESS_SECRET_KEY);
        res.status(200).json({ message: "로그아웃이 완료되었습니다." });
    } catch (err) {
        next(err);
    }
};

//토큰갱신
const refresh = async (req, res, next) => {
    try {
        const token = req.accessToken;
        const user = jwt.verify(token, process.env.REFRESH_SECRET_KEY);
        const newAccessToken = generateAccessToken(user);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
       next(err);
    }
};

// 토큰 검사
const validate = async (req, res) => {
    try {
        const token = req.accessToken;
        const user = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
        res.json({ valid: true, user });
    } catch (e) {
        res.json({ valid: false });
    }
};

module.exports = {
    login,
    refresh,
    logout,
    validate
}