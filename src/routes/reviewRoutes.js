const express = require('express');
const reviewController = require('../controllers/reviewControllers');

const router = express.Router();

router.post('/', reviewController.createReview);
router.get('/', reviewController.findAll);
router.get('/:id', reviewController.findPostById);


module.exports = router;