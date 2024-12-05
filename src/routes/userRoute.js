const express = require('express');
const { register, deactivateUser } = require('../controllers/userController');
const { validationErrorHandler } = require('../middlewares/validationErrorHandler');
const { registerValidator } = require('../utils/registerValidator');
const { authenticate } = require('../middlewares/authenticate');
const upload = require('../middlewares/upload.js'); // 파일 업로드 미들웨어 추가

const router = express.Router();

router.post('/register', upload.single('profileImage'), registerValidator, validationErrorHandler, register);
router.delete('/', authenticate, deactivateUser);

module.exports = router;
