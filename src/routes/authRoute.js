const express = require('express');
const { register, login, refresh, deleteUser } = require('../controllers/authController');
const { check } = require('express-validator');

const router = express.Router();

router.post('/register', [
    check('email').notEmpty().withMessage("필수입력 항목입니다.").isEmail().withMessage("이메일형식에 맞지 않습니다."),
    check('password').notEmpty().withMessage("필수입력 항목입니다.")
], register);
router.post('/login', login);
router.post('/refresh', refresh);
router.delete("/delete", deleteUser);

module.exports = router;
