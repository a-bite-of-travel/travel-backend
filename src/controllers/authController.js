const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const userService = require('../services/userService');
const { validationResult } = require("express-validator");

//회원가입
const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(e => e.msg) })
        }

         // 이메일 중복 체크
         const existingUser = await userService.findUserByEmail(email);
         if (existingUser) {
             return res.status(400).json({ message: "이미 사용 중인 이메일입니다." });
         }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userService.createUser({
            email: email, password: hashedPassword,
        });
        res.status(201).json({ data: user, message: '회원가입 성공' })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
}

//로그인
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.status(200).json({ accessToken, refreshToken })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
};

//토큰갱신
const jwt = require("jsonwebtoken");
const refresh = async (req, res) => {
    const { token } = req.body; //refresh token
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'refresh', (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken(user);
        res.status(200).json({ accessToken })
    })
}

module.exports = {
    register,
    login,
    refresh,
}