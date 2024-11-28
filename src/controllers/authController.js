const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const userService = require('../services/userService');
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");


//회원가입
const register = async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('File:', req.file);
    console.log('register');
    
    const { email, password,confirmPassword, nickName } = req.body;
    const profile_img = req.file; 
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        if (password !== confirmPassword) {
            return res.status(400).json({ errors: [{ param: "confirmPassword", msg: "비밀번호가 서로 일치하지 않습니다." }] });
        }
        
        // 탈퇴한 회원
        const deletedUser = await userService.findUserByEmail(email);
        if (deletedUser && deletedUser.isDisabled) {
            return res.status(403).json({ errors: [{ param: "email", msg: "이 계정은 비활성화되었습니다." }] });
        }

        // 이메일 중복 체크
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ errors: [{ param: "email", msg: "이미 사용 중인 이메일입니다." }] });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userService.createUser({
            email: email,
            password: hashedPassword,
            confirmPassword : hashedPassword,
            nickName: nickName,
            profile_img: profile_img ? profile_img.path : null 
        });
        res.status(201).json({ data: user, message: '회원가입 성공' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ errors: [{ param: "general", msg: err.message }] });
    }
}

//로그인
const login = async (req, res) => {
    const { nickName,email, password } = req.body;
    try {
        const user = await userService.findUserByEmail(email);
        if (user && user.isDisabled) {
            return res.status(403).json({ errors: [{ param: "email", msg: "이 계정은 비활성화되었습니다." }] });
        }

        if (!user) {
            return res.status(400).json({ errors: [{ param: "email", msg: "이메일 또는 비밀번호가 올바르지 않습니다." }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ param: "password", msg: "이메일 또는 비밀번호가 올바르지 않습니다." }] });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(200).json({
            id: user._id,
            email: user.email,
            accessToken,
            refreshToken,
            nickName: user.nickName,
        })
    } catch (e) {
        res.status(500).json({ errors: [{ param: "general", msg: e.message }] });
    }
};

//토큰갱신
const refresh = async (req, res) => {
    const { token } = req.body; //refresh token
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'refresh', (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken(user);
        res.status(200).json({ accessToken })
    })
}

//로그아웃
const logout = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ errors: [{ param: "authorization", msg: "토큰이 필요합니다." }] });
    }

    const token = authHeader.split(" ")[1];

    try {
        jwt.verify(token, 'access'); // 
        res.status(200).json({ message: "로그아웃이 완료되었습니다." });
    } catch (err) {
        console.error("로그아웃 실패:", err.message);

        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return res.status(403).json({ errors: [{ param: "token", msg: "유효하지 않은 토큰입니다." }] });
        }

        res.status(500).json({ errors: [{ param: "general", msg: "서버 오류가 발생했습니다." }] });
    }
};


//회원탈퇴
const deleteUser = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ errors: [{ param: "authorization", msg: "토큰이 필요합니다." }] });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, 'access'); // JWT 검증
        const userId = decoded.id;

        const result = await userService.softDeleteUser(userId);

        if (!result) {
            return res.status(404).json({ errors: [{ param: "user", msg: "사용자를 찾을 수 없습니다." }] });
        }

        res.status(200).json({ message: "회원탈퇴가 완료되었습니다.", data: result });
    } catch (err) {
        console.error("회원탈퇴 실패:", err.message);

        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return res.status(403).json({ errors: [{ param: "token", msg: "유효하지 않은 토큰입니다." }] });
        }

        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

const validate = async (req, res) => {
  const { token } = req.body; // refresh token
  if (!token) return res.sendStatus(401);
  try {
    const user = jwt.verify(token, "access");
    res.json({ valid: true, user });
  } catch (e) {
    res.json({ valid: false });
  }
};

module.exports = {
    register,
    login,
    refresh,
    logout,
    deleteUser,
    validate
}