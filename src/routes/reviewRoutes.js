const express = require('express');
const reviewController = require('../controllers/reviewControllers');

const router = express.Router();

router.post('/', reviewController.createReview); //리뷰 작성
router.get('/', reviewController.findAll); //리뷰 목록조회
router.get('/:id', reviewController.findPostById); //리뷰 아이디로 조회


module.exports = router;