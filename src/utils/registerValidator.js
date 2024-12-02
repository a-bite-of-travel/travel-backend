const { check } = require('express-validator');

const registerValidator = [
    check('email')
        .isEmail().withMessage('유효한 이메일 형식이 아닙니다.')
        .notEmpty().withMessage('이메일은 필수 입력 항목입니다.'),
    check('password')
        .notEmpty().withMessage('비밀번호는 필수 입력 항목입니다.')
        .isLength({ min: 8 }).withMessage('비밀번호는 최소 8자 이상이어야 합니다.')
        .matches(/[\W_]/).withMessage('비밀번호에는 최소 하나의 특수 문자가 포함되어야 합니다.'),
    check('nickName')
        .notEmpty().withMessage('닉네임은 필수 입력 항목입니다.')
        .isLength({ min: 2, max: 8 }).withMessage('닉네임은 2자 이상, 8자 이하로 입력해야 합니다.'),
    check('confirmPassword')
        .notEmpty().withMessage('비밀번호 확인은 필수 입력 항목입니다.')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            }
            return true;
        }),
];

module.exports = { registerValidator };
