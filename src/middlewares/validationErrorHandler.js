const { validationResult } = require('express-validator');

const validationErrorHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: '회원가입 실패',
            errors: errors.array(), // 배열로 반환
        });
    }
    next();
};

module.exports = { validationErrorHandler };