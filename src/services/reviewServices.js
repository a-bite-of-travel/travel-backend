const mongoose = require('mongoose');
const reviewModel = require('../models/reviewModel');
const commentModel = require('../schemas/comment');

//리뷰 작성
const createReview = async(data) =>{
    const review = await reviewModel.createReview(data);
    return review;
};

//리뷰 목록조회
const findAll = async(page, limit) =>{

    const review = await reviewModel.findAll();
    const totalPosts = review.length; //배열의 길이 사용
    const totalPages = Math.ceil(totalPosts / limit); // 전체 페이지 수 계산

    return { review, totalPosts, totalPages, current: page }
}

//유저 리뷰 목록조회
const findUserReview = async (userId) => {
    return await reviewModel.findUserReview(new mongoose.Types.ObjectId(userId));
};

//리뷰 아이디로 조회
const findPostById = async (id) => {
    return await reviewModel.findPostById(id);
}

//리뷰 수정
const updatePost = async (id, data) => {
    return await reviewModel.updatePost(id, data);
}

//리뷰 삭제
const deletePost = async (id) => {
    return await reviewModel.deletePost(id);
}

//댓글 달기
const createComment = async (id, data) =>{
    return await reviewModel.createComment(id, data);
}

//댓글 수정
const updateComment = async (id, data) => {
    const updatedComment = await commentModel.findByIdAndUpdate(
        id,
        { $set: data }, // 업데이트할 데이터
        { new: true }   // 수정된 문서 반환
    );
    if (!updatedComment) {
        throw new Error('Comment not found');
    }
    return updatedComment;
};

//댓글 삭제
const deleteComment = async (id) => {
    const deletedComment = await commentModel.findByIdAndDelete(id);
    if (!deletedComment) {
        throw new Error('Comment not found');
    }
    return deletedComment;
};


module.exports ={
    createReview,
    findAll,
    findPostById,
    updatePost,
    deletePost,
    createComment,
    updateComment,
    deleteComment,
    findUserReview
};