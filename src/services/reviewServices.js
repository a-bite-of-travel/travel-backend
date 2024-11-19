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

module.exports ={
    createReview,
    findAll,
    findPostById
};