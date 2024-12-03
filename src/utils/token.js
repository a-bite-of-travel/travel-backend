const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (user) => {// access token
    return jwt.sign({
        id: user.id,
        email: user.email,
    }, process.env.ACCESS_SECRET_KEY, {expiresIn: '14d'});
}

const generateRefreshToken = (user) => { // refresh token 
    return jwt.sign({
        id: user._id,
    }, process.env.REFRESH_SECRET_KEY, {expiresIn: '14d'});
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
}