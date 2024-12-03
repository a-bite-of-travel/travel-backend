const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const ServiceError = require('../middlewares/serviceError');
require('dotenv').config();

const authenticate = (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    // chagned
    console.log("authenticate", req.headers.authorization);
    token = req.headers.authorization.split(" ")[1]; // chagned
    // Bearer xxxxxxx
  } else {
    throw new ServiceError('토큰이 존재하지 않습니다.', null, 401);
  }

  jwt.verify(token, process.env.ACCESS_SECRET_KEY, async (err, user) => {
    try {
      if (err)
        throw new ServiceError('토큰이 유효하지 않습니다', null, 401);

      user = await userService.existingUserFunc(user.email)
      req.user = { id: user._id,
        email: user.email,
        nickName: user.nickName,
        profileImage: user.profileImage
      };
      req.accessToken = token;
      next();
    } catch (err) {
      next(err)
    }
  });
};

module.exports = {
  authenticate,
};
