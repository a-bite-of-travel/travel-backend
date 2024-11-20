const reviewModel = require('../models/reviewModel');

//리뷰 작성
const createReview = async(data) =>{
    const review = await reviewModel.createReview(data);
    return review;
};

//리뷰 목록조회
const findAll = async() =>{
    return await reviewModel.findAll();
}

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

module.exports ={
    createReview,
    findAll,
    findPostById,
    updatePost,
    deletePost
};