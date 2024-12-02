const ServiceError = require('./serviceError');

const errorHandler = (err, req, res, next) => {
    if (err instanceof ServiceError) {
        return res.status(err.statusCode).json({
            message: err.message,
            data: err.data,
        });
    }

    console.error(err.stack);
    res.status(500).json({
        message: 'server error',
        error: err.message,
    });
};

module.exports = errorHandler;
