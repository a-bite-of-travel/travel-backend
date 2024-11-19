const reviewModel = require('../schemas/review');

//리뷰 작성
const createReview = async(data) =>{
    const insertReview = new reviewModel(data);
    return await insertReview.save();
}

//리뷰 목록조회
const findAll = async () => {
    return await reviewModel.find();
}

//리뷰 아이디로 조회
const findPostById = async (id) => {
    return await reviewModel.findById(id);
}

module.exports  = { 
    createReview,
    findAll,
    findPostById
};