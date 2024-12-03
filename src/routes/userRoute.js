const express = require('express');
const { register, deactivateUser } = require('../controllers/userController');
const { validationErrorHandler } = require('../middlewares/validationErrorHandler');
const { registerValidator } = require('../utils/registerValidator');
const { authenticate } = require('../middlewares/authenticate');

const router = express.Router();

router.post('/register', registerValidator, validationErrorHandler, register);
router.delete('/', authenticate, deactivateUser);

module.exports = router;
