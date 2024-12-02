const express = require('express');
const { findAll } = require("../controllers/userController");

const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/', findAll)

module.exports = router;