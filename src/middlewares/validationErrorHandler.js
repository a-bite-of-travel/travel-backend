const { validationResult } = require('express-validator');

const validationErrorHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array()
            .map(error => `${error.param}: ${error.msg}`)
            .join(', ');

        return res.status(400).json({
            message: '회원가입 실패',
            errors: errorMessages,
        });
    }
    next();
};

module.exports = { validationErrorHandler };
