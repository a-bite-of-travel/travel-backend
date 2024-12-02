const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => { // access token 
    return jwt.sign({
        id: user._id,
        email: user.email,
        nickName: user.nickName,
        profileImage: user.profileImage,
    }, 'access', {expiresIn: '14d'});
}

const generateRefreshToken = (user) => { // refresh token 
    return jwt.sign({
        id: user._id,
        email: user.email,
        nickName: user.nickName,
        profileImage: user.profileImage,
    }, 'refresh', {expiresIn: '14d'});
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
}