const express = require('express');
const reviewController = require('../controllers/reviewControllers');
const { check } = require("express-validator");
const { authenticate } = require("../middleware/auth_middleware");

const router = express.Router();

router.post('/', authenticate, reviewController.createReview); //리뷰 작성
router.get('/', reviewController.findAll); //리뷰 목록조회
router.get('/:id', reviewController.findPostById); //리뷰 아이디로 조회
router.put('/:id', authenticate, reviewController.updatePost); //리뷰 수정
router.delete('/:id', authenticate, reviewController.deletePost); //리뷰 삭제
router.put('/:id/comments', authenticate, reviewController.createComment); //댓글 달기
router.put('/comments/:id', authenticate, reviewController.updateComment); //댓글 수정
router.delete('/comments/:id', authenticate, reviewController.deleteComment); // 댓글 삭제

module.exports = router;