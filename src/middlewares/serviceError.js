class ServiceError extends Error {
    constructor(message, data, statusCode = 400) {
        super(message);
        this.data = data;
        this.statusCode = statusCode;
    }
}

module.exports = ServiceError;
