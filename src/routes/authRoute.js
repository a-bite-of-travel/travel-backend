const express = require('express');
const { register, login, refresh, deleteUser, logout } = require('../controllers/authController');
const { check } = require('express-validator');
const path = require('path');
const multer = require('multer');

const upload_dir = "public/uploads";

const storage = multer.diskStorage({
    destination: `${upload_dir}`,
    filename: function (req, file, cb) {
        console.log('cb', file.fieldname + '-' + Date.now() + '-' + file.originalname)
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/register', upload.single('profile_img'), [
    check('email').notEmpty().withMessage("필수입력 항목입니다.").isEmail().withMessage("이메일형식에 맞지 않습니다."),
    check('password').notEmpty().withMessage("필수입력 항목입니다."),
    check('confirmPassword').notEmpty().withMessage("비밀번호 확인이 필요합니다.")
], register);
router.post('/login', login);
router.post('/refresh', refresh);
router.delete("/delete", deleteUser);
router.post('/logout', logout);

module.exports = router;
