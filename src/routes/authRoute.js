const express = require('express');
const { authenticate } = require('../middlewares/authenticate');
const { login, refresh, logout, validate } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/refresh', authenticate, refresh);
router.post('/logout', authenticate, logout);
router.post('/validate', authenticate, validate,);

module.exports = router;
