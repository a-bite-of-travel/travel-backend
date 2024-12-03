const express = require('express');
const upload = require('../middlewares/upload');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

router.post('/single', upload.single('file'), uploadController.uploadSingleFile);
router.post('/multiple', upload.array('files', 5), uploadController.uploadMultipleFiles);

module.exports = router;
