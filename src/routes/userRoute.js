const express = require('express');
const { findAll } = require("../controllers/userController");

const router = express.Router();

router.get('/', findAll)

module.exports = router;